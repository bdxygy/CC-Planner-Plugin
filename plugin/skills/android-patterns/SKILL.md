---
name: Android Patterns
description: This skill should be used when the user asks to "plan an Android app", "design Android architecture", "create Android components", mentions Android development, or refers to Jetpack Compose, ViewModel, Activities, or Fragments. Provides comprehensive Android architecture patterns for both Jetpack Compose and classic XML-based UI.
version: 0.1.0
---

# Android Patterns

Android development requires understanding both modern declarative UI (Jetpack Compose) and traditional imperative UI (XML layouts). This skill provides architecture patterns for building testable, maintainable Android applications following Android best practices and architectural guidelines.

## Core Android Principles

**UI Framework Choice:**

- **Jetpack Compose**: Modern declarative UI toolkit, recommended for new projects
- **Classic XML**: Traditional View-based UI, still widely used in existing projects
- **Hybrid**: Mix Compose and XML in migration scenarios

**Architecture Guidelines:**

- Follow Google's official app architecture guide
- Separate concerns: UI layer, domain layer, data layer
- Use Kotlin coroutines for asynchronous work
- Implement dependency injection with Hilt
- Follow unidirectional data flow

**Testability:**

- UI components should be testable with Compose UI tests or Espresso
- ViewModels should be unit testable without Android framework
- Repositories should be testable without Android dependencies
- Use fakes/mocks for Android framework dependencies

## Android Architecture Layers

### UI Layer

**Responsibilities:**

- Display application data on screen
- Capture user input and propagate to business logic
- Observe and react to state changes
- Handle navigation between screens

**Jetpack Compose Structure:**

```
ui/
  compose/
    screens/
      HomeScreen.kt
      DetailScreen.kt
    components/
      Button.kt
      Card.kt
    navigation/
      NavGraph.kt
  viewmodel/
    HomeViewModel.kt
    DetailViewModel.kt
```

**Classic XML Structure:**

```
ui/
  activities/
    MainActivity.kt
    DetailActivity.kt
  fragments/
    HomeFragment.kt
    DetailFragment.kt
  adapters/
    RecyclerAdapter.kt
  viewmodel/
    HomeViewModel.kt
    DetailViewModel.kt
```

### Domain Layer

**Responsibilities:**

- Contain business logic
- Use cases for feature-specific logic
- Repository interfaces (implemented by data layer)
- Domain models (transform data entities)

**Structure:**

```
domain/
  model/
    UserModel.kt
    ProductModel.kt
  repository/
    UserRepository.kt
    ProductRepository.kt
  usecase/
    GetUserUseCase.kt
    GetProductsUseCase.kt
```

### Data Layer

**Responsibilities:**

- Expose and manage application data
- Implement repository interfaces from domain
- Handle data sources (Room, Retrofit, DataStore)
- Provide data transformation and caching

**Structure:**

```
data/
  repository/
    UserRepositoryImpl.kt
    ProductRepositoryImpl.kt
  local/
    dao/
      UserDao.kt
    database/
      AppDatabase.kt
  remote/
    api/
      ApiService.kt
    dto/
      UserDto.kt
```

## Jetpack Compose Patterns

### Composable Components

**Screen-level composables:**

```kotlin
@Composable
fun HomeScreen(
  uiState: HomeUiState,
  onEvent: (HomeEvent) -> Unit
) {
  when (uiState) {
    is HomeUiState.Loading -> LoadingView()
    is HomeUiState.Success -> SuccessContent(uiState.data, onEvent)
    is HomeUiState.Error -> ErrorView(uiState.message, onEvent)
  }
}
```

**Reusable components:**

```kotlin
@Composable
fun ProductCard(
  product: Product,
  onClick: () -> Unit
) {
  Card(onClick = onClick) {
    // Product content
  }
}
```

**State management patterns:**

- Use `remember` for local UI state
- Use `viewModel()` for screen-level state
- Use `produceState` for integrating with non-Compose streams
- Use `derivedStateOf` for computed state

### Compose State Management

**ViewModel with StateFlow:**

```kotlin
class HomeViewModel : ViewModel() {
  private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
  val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

  init {
    loadProducts()
  }

  private fun loadProducts() {
    viewModelScope.launch {
      _uiState.value = HomeUiState.Loading
      getProductsUseCase()
        .catch { _uiState.value = HomeUiState.Error(it.message) }
        .collect { products ->
          _uiState.value = HomeUiState.Success(products)
        }
    }
  }
}
```

**Compose collection:**

```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = viewModel()) {
  val uiState by viewModel.uiState.collectAsState()
  // Render UI based on state
}
```

### Compose Navigation

**Navigation setup:**

```kotlin
@Composable
fun AppNavigation() {
  val navController = rememberNavController()
  NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen(onNavigate = { navController.navigate("detail") }) }
    composable("detail") { DetailScreen(onBack = { navController.popBackStack() }) }
  }
}
```

## Classic Android Patterns

### Activity/Fragment Structure

**Activity with navigation:**

```kotlin
class MainActivity : AppCompatActivity(R.layout.activity_main) {
  private val viewModel: HomeViewModel by viewModels()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setupObservers()
    loadProducts()
  }

  private fun setupObservers() {
    viewModel.products.observe(this) { products ->
      adapter.submitList(products)
    }
  }
}
```

**Fragment with ViewModel:**

```kotlin
class HomeFragment : Fragment() {
  private val viewModel: HomeViewModel by viewModels()
  private lateinit var binding: FragmentHomeBinding

  override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View {
    binding = FragmentHomeBinding.inflate(inflater, container, false)
    return binding.root
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    setupObservers()
  }

  private fun setupObservers() {
    viewModel.uiState.observe(viewLifecycleOwner) { uiState ->
      when (uiState) {
        is HomeUiState.Loading -> showLoading()
        is HomeUiState.Success -> showContent(uiState.data)
        is HomeUiState.Error -> showError(uiState.message)
      }
    }
  }
}
```

### RecyclerView Pattern

**Adapter implementation:**

```kotlin
class ProductAdapter(
  private val onItemClick: (Product) -> Unit
) : ListAdapter<Product, ProductViewHolder>(DiffCallback) {

  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
    return ProductViewHolder(
      ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false),
      onItemClick
    )
  }

  override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
    holder.bind(getItem(position))
  }

  object DiffCallback : DiffUtil.ItemCallback<Product>() {
    override fun areItemsTheSame(oldItem: Product, newItem: Product): Boolean {
      return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Product, newItem: Product): Boolean {
      return oldItem == newItem
    }
  }
}
```

## State Management Patterns

### LiveData (Classic)

**ViewModel with LiveData:**

```kotlin
class HomeViewModel : ViewModel() {
  private val _products = MutableLiveData<List<Product>>()
  val products: LiveData<List<Product>> = _products

  private val _loading = MutableLiveData<Boolean>()
  val loading: LiveData<Boolean> = _loading

  fun loadProducts() {
    viewModelScope.launch {
      _loading.value = true
      val result = getProductsUseCase()
      _products.value = result
      _loading.value = false
    }
  }
}
```

### StateFlow (Modern, works with both)

**ViewModel with StateFlow:**

```kotlin
class HomeViewModel : ViewModel() {
  private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
  val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

  init {
    loadProducts()
  }

  private fun loadProducts() {
    viewModelScope.launch {
      _uiState.value = HomeUiState.Loading
      _uiState.value = getProductsUseCase()
        .map { products -> HomeUiState.Success(products) }
        .catch { HomeUiState.Error(it.message ?: "Unknown error") }
        .first()
    }
  }
}
```

**Collect in Fragment:**

```kotlin
lifecycleScope.launch {
  repeatOnLifecycle(Lifecycle.State.STARTED) {
    viewModel.uiState.collect { uiState ->
      when (uiState) {
        is HomeUiState.Loading -> showLoading()
        is HomeUiState.Success -> showContent(uiState.data)
        is HomeUiState.Error -> showError(uiState.message)
      }
    }
  }
}
```

## Dependency Injection

### Hilt Setup

**Application class:**

```kotlin
@HiltAndroidApp
class MyApp : Application()
```

**Provide dependencies:**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DataModule {
  @Provides
  @Singleton
  fun provideRetrofit(): Retrofit =
    Retrofit.Builder()
      .baseUrl("https://api.example.com")
      .addConverterFactory(MoshiConverterFactory.create())
      .build()

  @Provides
  @Singleton
  fun provideApiService(retrofit: Retrofit): ApiService =
    retrofit.create(ApiService::class.java)

  @Provides
  fun provideUserRepository(
    apiService: ApiService,
    database: AppDatabase
  ): UserRepository = UserRepositoryImpl(apiService, database)
}
```

**Inject in ViewModel:**

```kotlin
@HiltViewModel
class HomeViewModel @Inject constructor(
  private val getProductsUseCase: GetProductsUseCase
) : ViewModel()
```

**Inject in Fragment:**

```kotlin
@AndroidEntryPoint
class HomeFragment : Fragment() {
  private val viewModel: HomeViewModel by viewModels()
}
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**

- User opens app → Home screen displays correctly
- User taps product → Detail screen opens with correct product
- User scrolls list → LazyColumn/RecyclerView scrolls smoothly
- User searches → Search results update and display
- User navigates back → Previous screen restores state

**Edge Cases:**

- Empty product list → Empty state displays with helpful message
- Single product → Displays correctly without list
- Large list → Pagination/lazy loading works
- Rapid scrolling → No UI jank, performance maintained
- Configuration change → Screen rotation preserves state

**Failure States:**

- Network error → Error message displays with retry option
- Server error (5xx) → User-friendly error, retry available
- Timeout → Loading indicator with timeout message
- Authentication error → Redirect to login screen
- Malformed data → Graceful fallback, error logging

### Backend Testing Cases (Logic-Driven)

**ViewModel Tests:**

- Initial state → Loading state is set
- Success response → Success state with correct data
- Error response → Error state with message
- Loading state → Progress indicator emits
- State transformation → Data maps correctly from domain to UI

**Use Case Tests:**

- Business rules → Validation logic tested
- Boundary conditions → Empty list, single item, large list
- Error handling → Repository errors propagate correctly
- Cancellation → Coroutine cancellation handled

**Repository Tests:**

- Local data → Room queries return correct data
- Remote data → Retrofit API calls map to DTOs correctly
- Caching → Data source switches correctly
- Data transformation → DTO to domain mapping correct

## Context7 Integration

For Android-specific documentation:

- Use Context7 for Jetpack Compose API reference
- Query Context7 for latest Jetpack library patterns
- Reference Context7 for Material 3 Design components
- Check Context7 for Hilt dependency injection patterns
- Query Context7 for Room database setup and migrations

## Best Practices

**DO:**

- Follow Google's official architecture recommendations
- Use Kotlin coroutines for async operations
- Implement proper lifecycle awareness
- Use sealed classes for UI state
- Separate UI, domain, and data layers
- Write unit tests for ViewModels and use cases
- Use dependency injection for testability

**DON'T:**

- Put business logic in Activities/Fragments
- Use GlobalScope for coroutines
- Leak contexts or views
- Mix UI framework code with business logic
- Skip error handling in coroutines
- Forget to cancel coroutine jobs
