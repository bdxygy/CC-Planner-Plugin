---
name: iOS Swift Patterns
description: This skill should be used when the user asks to "plan an iOS app", "design iOS architecture", "create SwiftUI components", mentions iOS development, or refers to UIKit, SwiftUI, ViewControllers, Combine, or Swift development. Provides comprehensive iOS architecture patterns for both SwiftUI and UIKit.
version: 0.1.0
---

# iOS Swift Patterns

iOS development requires understanding both modern declarative UI (SwiftUI) and traditional imperative UI (UIKit). This skill provides architecture patterns for building testable, maintainable iOS applications following Apple's architectural guidelines and Swift best practices.

## Core iOS Principles

**UI Framework Choice:**

- **SwiftUI**: Modern declarative UI framework, recommended for new iOS 14+ projects
- **UIKit**: Traditional imperative UI framework, battle-tested and widely used
- **Hybrid**: Mix SwiftUI and UIKit in migration scenarios

**Architecture Guidelines:**

- Follow Apple's MVC, MVVM, or TCA patterns
- Use Combine or async/await for asynchronous work
- Implement dependency injection (property injection, environment objects)
- Follow unidirectional data flow
- Use protocol-oriented programming for testability

**Testability:**

- ViewModels should be unit testable without iOS framework
- Views should be testable with XCUITest
- Use protocols and dependency injection for mocking
- Test business logic independently of UI

## iOS Architecture Patterns

### MVVM (Model-View-ViewModel)

**Recommended for SwiftUI and UIKit:**

```
Models/          - Domain models and business logic
ViewModels/      - Presentation logic and state management
Views/           - SwiftUI views or UIKit ViewControllers
Services/        - API, database, and external services
Repositories/    - Data access layer
```

**ViewModel example:**

```swift
import Combine
import Foundation

@MainActor
class HomeViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let getProductsUseCase: GetProductsUseCase

    init(getProductsUseCase: GetProductsUseCase) {
        self.getProductsUseCase = getProductsUseCase
    }

    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            products = try await getProductsUseCase.execute()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

### TCA (The Composable Architecture)

**Alternative for complex state management:**

```
Features/
  Home/
    Models/
      HomeState.swift
      HomeAction.swift
    View/
      HomeView.swift
    Reducer/
      HomeReducer.swift
```

## SwiftUI Patterns

### View Structure

**Screen-level views:**

```swift
struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        NavigationView {
            Group {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                } else if let error = viewModel.errorMessage {
                    ErrorView(message: error) {
                        viewModel.loadProducts()
                    }
                } else {
                    ProductList(products: viewModel.products)
                }
            }
            .navigationTitle("Home")
            .task {
                await viewModel.loadProducts()
            }
        }
    }
}
```

**Reusable components:**

```swift
struct ProductCard: View {
    let product: Product
    let onTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: product.imageURL) { image in
                image.resizable()
            } placeholder: {
                ProgressView()
            }
            .frame(height: 200)

            Text(product.name)
                .font(.headline)

            Text(product.price, format: .currency(code: "USD"))
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .onTapGesture(perform: onTap)
    }
}
```

### SwiftUI State Management

**@State and @Binding:**

```swift
struct SearchBar: View {
    @State private var searchText = ""

    var body: some View {
        TextField("Search", text: $searchText)
            .textFieldStyle(.roundedBorder)
    }
}
```

**@StateObject and @ObservedObject:**

```swift
struct ProductListView: View {
    @StateObject private var viewModel = ProductListViewModel()

    var body: some View {
        List(viewModel.products) { product in
            ProductCard(product: product)
        }
        .task {
            await viewModel.loadProducts()
        }
    }
}
```

**@EnvironmentObject for shared state:**

```swift
@main
struct MyApp: App {
    @StateObject private var sessionManager = SessionManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(sessionManager)
        }
    }
}
```

### SwiftUI Navigation

**NavigationStack (iOS 16+):**

```swift
@State private var path: [Product] = []

var body: some View {
    NavigationStack(path: $path) {
        List(products) { product in
            NavigationLink(value: product) {
                Text(product.name)
            }
        }
        .navigationDestination(for: Product.self) { product in
            ProductDetailView(product: product)
        }
    }
}
```

**Sheet presentation:**

```swift
@State private var showingDetail = false
@State private var selectedProduct: Product?

var body: some View {
    List(products) { product in
        Button(product.name) {
            selectedProduct = product
            showingDetail = true
        }
    }
    .sheet(isPresented: $showingDetail) {
        if let product = selectedProduct {
            ProductDetailView(product: product)
        }
    }
}
```

## UIKit Patterns

### UIViewController Structure

**View controller with ViewModel:**

```swift
class HomeViewController: UIViewController {
    private let viewModel: HomeViewModel
    private var cancellables = Set<AnyCancellable>()

    private lazy var tableView: UITableView = {
        let table = UITableView()
        table.delegate = self
        table.dataSource = self
        table.register(ProductCell.self, forCellReuseIdentifier: "ProductCell")
        return table
    }()

    init(viewModel: HomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        bindViewModel()
        viewModel.loadProducts()
    }

    private func bindViewModel() {
        viewModel.$products
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.tableView.reloadData()
            }
            .store(in: &cancellables)

        viewModel.$isLoading
            .receive(on: DispatchQueue.main)
            .sink { [weak self] isLoading in
                // Show/hide loading indicator
            }
            .store(in: &cancellables)
    }
}
```

### UITableView/UICollectionView

**UITableView diffable data source:**

```swift
class HomeViewController: UIViewController {
    private var dataSource: UITableViewDiffableDataSource<Int, Product>!

    private func configureDataSource() {
        dataSource = UITableViewDiffableDataSource(
            tableView: tableView
        ) { tableView, indexPath, product in
            let cell = tableView.dequeueReusableCell(
                withIdentifier: "ProductCell",
                for: indexPath
            ) as? ProductCell
            cell?.configure(with: product)
            return cell
        }
    }

    private func applySnapshot(products: [Product], animatingDifferences: Bool = true) {
        var snapshot = NSDiffableDataSourceSnapshot<Int, Product>()
        snapshot.appendSections([0])
        snapshot.appendItems(products)
        dataSource.apply(snapshot, animatingDifferences: animatingDifferences)
    }
}
```

### Programmatic UI Layout

**Auto Layout anchors:**

```swift
class ProductViewController: UIViewController {
    private let titleLabel = UILabel()
    private let priceLabel = UILabel()
    private let imageView = UIImageView()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
    }

    private func setupViews() {
        view.addSubview(titleLabel)
        view.addSubview(priceLabel)
        view.addSubview(imageView)

        NSLayoutConstraint.activate([
            imageView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            imageView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            imageView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            imageView.heightAnchor.constraint(equalToConstant: 200),

            titleLabel.topAnchor.constraint(equalTo: imageView.bottomAnchor, constant: 16),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),

            priceLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
            priceLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16)
        ])
    }
}
```

## State Management Patterns

### Combine Framework

**Publisher/Subscriber pattern:**

```swift
class ProductViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let productService: ProductServiceProtocol
    private var cancellables = Set<AnyCancellable>()

    init(productService: ProductServiceProtocol) {
        self.productService = productService
    }

    func loadProducts() {
        isLoading = true

        productService.fetchProducts()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.isLoading = false
                if case .failure(let error) = completion {
                    self?.errorMessage = error.localizedDescription
                }
            } receiveValue: { [weak self] products in
                self?.products = products
            }
            .store(in: &cancellables)
    }
}
```

### Async/Await (Modern Swift)

**Async/await in ViewModel:**

```swift
@MainActor
class ProductViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let productService: ProductServiceProtocol

    init(productService: ProductServiceProtocol) {
        self.productService = productService
    }

    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            products = try await productService.fetchProducts()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

## Dependency Injection

### Protocol-Based Injection

**Define protocols:**

```swift
protocol ProductServiceProtocol {
    func fetchProducts() async throws -> [Product]
}

class ProductService: ProductServiceProtocol {
    func fetchProducts() async throws -> [Product] {
        // Implementation
    }
}
```

**Inject into ViewModel:**

```swift
class HomeViewModel: ObservableObject {
    private let productService: ProductServiceProtocol

    init(productService: ProductServiceProtocol) {
        self.productService = productService
    }
}
```

**Inject in SwiftUI:**

```swift
struct HomeView: View {
    let productService: ProductServiceProtocol

    init(productService: ProductServiceProtocol = ProductService()) {
        self.productService = productService
    }

    var body: some View {
        HomeViewRepresentable(viewModel: HomeViewModel(productService: productService))
    }
}
```

### Environment Values (SwiftUI)

**Custom environment key:**

```swift
private struct ProductServiceKey: EnvironmentKey {
    static let defaultValue: ProductServiceProtocol = ProductService()
}

extension EnvironmentValues {
    var productService: ProductServiceProtocol {
        get { self[ProductServiceKey.self] }
        set { self[ProductServiceKey.self] = newValue }
    }
}
```

**Use in views:**

```swift
struct HomeView: View {
    @Environment(\.productService) var productService

    var body: some View {
        // Use productService
    }
}
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**

- User opens app → Home screen displays correctly
- User taps product → Detail view pushes with correct product
- User scrolls list → ScrollView/List scrolls smoothly
- User searches → Search results update and display
- User navigates back → Previous view restores state

**Edge Cases:**

- Empty product list → Empty view displays with helpful message
- Single product → Displays correctly without list
- Large list → LazyVStack/LazyStack renders efficiently
- Rapid scrolling → No UI jank, performance maintained
- Device rotation → Layout adapts correctly
- Dark mode → UI renders correctly in dark appearance

**Failure States:**

- Network error → Alert displays with retry option
- Server error (5xx) → User-friendly error, retry available
- Timeout → Loading indicator with timeout message
- Authentication error → Redirect to login screen
- Malformed data → Graceful fallback, error logging

### Backend Testing Cases (Logic-Driven)

**ViewModel Tests:**

- Initial state → Published properties have correct defaults
- Success response → Products array updates correctly
- Error response → ErrorMessage populated correctly
- Loading state → IsLoading toggles correctly
- Data transformation → DTO to model mapping correct

**Use Case Tests:**

- Business rules → Validation logic tested
- Boundary conditions → Empty array, single item, large array
- Error handling → Service errors propagate correctly
- Cancellation → Async tasks cancelled correctly

**Service Tests:**

- API calls → URLSession returns correct data
- Decoding → JSON decodes to models correctly
- Error handling → HTTP errors map to domain errors
- Caching → Cache strategy works correctly

## Context7 Integration

For iOS-specific documentation:

- Use Context7 for SwiftUI API reference
- Query Context7 for latest Swift patterns
- Reference Context7 for Combine framework usage
- Check Context7 for async/await best practices
- Query Context7 for Core Data setup and migrations

## Best Practices

**DO:**

- Follow Apple's Human Interface Guidelines
- Use Swift concurrency (async/await) for new code
- Implement proper error handling and recovery
- Use protocol-oriented programming for testability
- Follow SwiftUI data flow principles
- Write unit tests for ViewModels and business logic
- Use Xcode Preview for SwiftUI development

**DON'T:**

- Put business logic in ViewControllers/Views
- Force unwrap optionals excessively
- Block main thread with long operations
- Mix SwiftUI and UIKit unnecessarily
- Skip error handling in async code
- Forget to mark @MainActor when needed
- Ignore memory management (weak self, etc.)
