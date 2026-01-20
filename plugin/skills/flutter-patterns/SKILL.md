---
name: Flutter Patterns
description: This skill should be used when the user asks to "plan a Flutter app", "design Flutter architecture", "create Flutter widgets", mentions Flutter development, or refers to BLoC, Riverpod, Provider, or Dart development. Provides comprehensive Flutter architecture patterns for cross-platform mobile development.
version: 0.1.0
---

# Flutter Patterns

Flutter is a cross-platform framework using Dart language with declarative UI through widgets. This skill provides architecture patterns for building testable, maintainable Flutter applications following clean architecture and Flutter best practices.

## Core Flutter Principles

**Widget Architecture:**
- Everything is a widget (composition over inheritance)
- Immutable widgets describe UI for given configuration
- StatefulWidget manages mutable state
- Build method runs when state changes or widget rebuilds

**Architecture Guidelines:**
- Follow clean architecture (presentation, domain, data layers)
- Separate business logic from UI (BLoC, Riverpod, Provider)
- Use dependency injection for testability
- Implement proper state management pattern
- Follow unidirectional data flow

**Testability:**
- Widget tests for UI component testing
- Unit tests for business logic (BLoCs, providers, use cases)
- Integration tests for end-to-end flows
- Mock dependencies for isolated testing

## Flutter Architecture Layers

### Presentation Layer

**Responsibilities:**
- Display widgets and handle user interaction
- Observe state from BLoCs/providers
- Emit events to business logic
- Handle navigation

**Structure:**
```
lib/
  presentation/
    pages/
      home_page.dart
      detail_page.dart
    widgets/
      product_card.dart
      loading_widget.dart
    bloc/
      home/
        home_bloc.dart
        home_event.dart
        home_state.dart
    providers/
      product_provider.dart
```

### Domain Layer

**Responsibilities:**
- Business logic and use cases
- Domain models (entities)
- Repository interfaces

**Structure:**
```
lib/
  domain/
    entities/
      product.dart
      user.dart
    repositories/
      product_repository.dart
    usecases/
      get_products.dart
      add_to_cart.dart
```

### Data Layer

**Responsibilities:**
- Data transfer objects (DTOs)
- Repository implementations
- Data sources (API, local database)

**Structure:**
```
lib/
  data/
    models/
      product_model.dart
    repositories/
      product_repository_impl.dart
    datasources/
      product_api_service.dart
      product_local_datasource.dart
```

## State Management Patterns

### BLoC (Business Logic Component)

**Recommended for complex state:**

**Event definition:**
```dart
abstract class HomeEvent extends Equatable {
  const HomeEvent();

  @override
  List<Object> get props => [];
}

class HomeLoadProducts extends HomeEvent {}

class HomeRefreshProducts extends HomeEvent {}
```

**State definition:**
```dart
abstract class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object> get props => [];
}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<Product> products;

  const HomeLoaded(this.products);

  @override
  List<Object> get props => [products];
}

class HomeError extends HomeState {
  final String message;

  const HomeError(this.message);

  @override
  List<Object> get props => [message];
}
```

**BLoC implementation:**
```dart
class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final GetProductsUseCase getProductsUseCase;

  HomeBloc(this.getProductsUseCase) : super(HomeInitial()) {
    on<HomeLoadProducts>(_onLoadProducts);
    on<HomeRefreshProducts>(_onRefreshProducts);
  }

  Future<void> _onLoadProducts(
    HomeLoadProducts event,
    Emitter<HomeState> emit
  ) async {
    emit(HomeLoading());
    try {
      final products = await getProductsUseCase();
      emit(HomeLoaded(products));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }

  Future<void> _onRefreshProducts(
    HomeRefreshProducts event,
    Emitter<HomeState> emit
  ) async {
    try {
      final products = await getProductsUseCase();
      emit(HomeLoaded(products));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }
}
```

**BLoC provider in widget:**
```dart
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => HomeBloc(context.read<GetProductsUseCase>())
        ..add(HomeLoadProducts()),
      child: const HomeView(),
    );
  }
}
```

**BlocBuilder for state:**
```dart
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state is HomeLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is HomeLoaded) {
            return ListView.builder(
              itemCount: state.products.length,
              itemBuilder: (context, index) {
                return ProductCard(product: state.products[index]);
              },
            );
          } else if (state is HomeError) {
            return Center(child: Text('Error: ${state.message}'));
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
```

### Riverpod (Recommended for new projects)

**Provider definition:**
```dart
final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return ProductRepositoryImpl(
    apiService: ref.read(apiServiceProvider),
    localDataSource: ref.read(localDataSourceProvider),
  );
});

final getProductsUseCaseProvider = Provider<GetProductsUseCase>((ref) {
  return GetProductsUseCase(ref.read(productRepositoryProvider));
});

final homeViewModelProvider = StateNotifierProvider<HomeViewModel, HomeState>((ref) {
  return HomeViewModel(ref.read(getProductsUseCaseProvider));
});
```

**StateNotifier:**
```dart
class HomeViewModel extends StateNotifier<HomeState> {
  final GetProductsUseCase _getProductsUseCase;

  HomeViewModel(this._getProductsUseCase) : super(HomeInitial());

  Future<void> loadProducts() async {
    state = HomeLoading();
    try {
      final products = await _getProductsUseCase();
      state = HomeLoaded(products);
    } catch (e) {
      state = HomeError(e.toString());
    }
  }
}
```

**ConsumerWidget:**
```dart
class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewModel = ref.watch(homeViewModelProvider);

    useEffect(() {
      ref.read(homeViewModelProvider.notifier).loadProducts();
      return null;
    }, []);

    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: _buildBody(viewModel),
    );
  }

  Widget _buildBody(HomeState state) {
    if (state is HomeLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is HomeLoaded) {
      return ListView.builder(
        itemCount: state.products.length,
        itemBuilder: (context, index) {
          return ProductCard(product: state.products[index]);
        },
      );
    } else if (state is HomeError) {
      return Center(child: Text('Error: ${state.message}'));
    }
    return const SizedBox.shrink();
  }
}
```

### Provider (Simple state management)

**ChangeNotifier:**
```dart
class HomeViewModel extends ChangeNotifier {
  final GetProductsUseCase _getProductsUseCase;

  HomeViewModel(this._getProductsUseCase);

  List<Product> _products = [];
  List<Product> get products => _products;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  Future<void> loadProducts() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _products = await _getProductsUseCase();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

**ChangeNotifierProvider:**
```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(
      create: (_) => HomeViewModel(getProductsUseCase),
    ),
  ],
  child: const HomePage(),
)
```

## Widget Patterns

### StatelessWidget

**For widgets without state:**
```dart
class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const ProductCard({
    super.key,
    required this.product,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(
              product.imageUrl,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '\$${product.price}',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### StatefulWidget

**For widgets with internal state:**
```dart
class SearchBar extends StatefulWidget {
  final Function(String) onSearch;

  const SearchBar({
    super.key,
    required this.onSearch,
  });

  @override
  State<SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      decoration: const InputDecoration(
        hintText: 'Search...',
        prefixIcon: Icon(Icons.search),
      ),
      onSubmitted: widget.onSearch,
    );
  }
}
```

## Navigation Patterns

### Navigator 2.0 (Recommended)

**Router delegate:**
```dart
class AppRouter extends RouterDelegate<AppRoute>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<AppRoute> {
  @override
  final GlobalKey<NavigatorState> navigatorKey;

  AppRouter() : navigatorKey = GlobalKey<NavigatorState>();

  AppRoute? _currentRoute;

  @override
  AppRoute? get currentConfiguration => _currentRoute;

  @override
  Future<void> setNewRoutePath(AppRoute configuration) async {
    _currentRoute = configuration;
    notifyListeners();
  }

  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      pages: [
        MaterialPage(child: HomePage()),
        if (_currentRoute is DetailRoute)
          MaterialPage(child: DetailPage(product: (_currentRoute as DetailRoute).product)),
      ],
      onPopPage: (route, result) {
        if (!route.didPop(result)) {
          return false;
        }
        _currentRoute = null;
        notifyListeners();
        return true;
      },
    );
  }
}
```

### go_router (Recommended for simple apps)

**Router configuration:**
```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/detail/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return DetailPage(productId: id);
      },
    ),
  ],
);
```

**Use in app:**
```dart
MaterialApp.router(
  routerConfig: router,
)
```

## Dependency Injection

### get_it (Service Locator)

**Setup:**
```dart
final getIt = GetIt.instance;

void setupLocator() {
  // Services
  getIt.registerLazySingleton<ApiService>(() => ApiServiceImpl());
  getIt.registerLazySingleton<LocalDatabase>(() => LocalDatabaseImpl());

  // Repositories
  getIt.registerLazySingleton<ProductRepository>(
    () => ProductRepositoryImpl(
      apiService: getIt(),
      localDatabase: getIt(),
    ),
  );

  // Use cases
  getIt.registerFactory<GetProductsUseCase>(
    () => GetProductsUseCase(productRepository: getIt()),
  );

  // BLoCs
  getIt.registerFactory<HomeBloc>(
    () => HomeBloc(getProductsUseCase: getIt()),
  );
}
```

**Use in widget:**
```dart
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<HomeBloc>()..add(HomeLoadProducts()),
      child: const HomeView(),
    );
  }
}
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**
- User opens app → Home page displays correctly
- User taps product → Navigates to detail with correct product
- User scrolls list → ListView scrolls smoothly
- User searches → Search results update and display
- User navigates back → Previous page restores state

**Edge Cases:**
- Empty product list → Empty state displays with helpful message
- Single product → Displays correctly without list issues
- Large list → ListView lazy loads efficiently
- Rapid scrolling → No jank, 60fps maintained
- Different screen sizes → Responsive layout adapts

**Failure States:**
- Network error → Error message displays with retry
- Server error (5xx) → User-friendly error, retry available
- Timeout → Loading indicator with timeout message
- Authentication error → Redirect to login
- Malformed data → Graceful fallback, error logging

### Backend Testing Cases (Logic-Driven)

**BLoC Tests:**
- Initial state → Emits correct initial state
- Load products event → Emits loading then loaded
- Error event → Emits error state with message
- Multiple events → Handles in correct order
- State equality → Equatable implemented correctly

**Use Case Tests:**
- Business rules → Validation logic tested
- Boundary conditions → Empty list, single item, large list
- Error handling → Repository errors propagate
- Cancellation → Stream cancellation works

**Repository Tests:**
- API data source → HTTP client returns correct data
- Local data source → Database queries work
- Caching → Cache strategy works correctly
- Data transformation → Model mapping correct

## Context7 Integration

For Flutter-specific documentation:
- Use Context7 for Flutter widget API reference
- Query Context7 for latest Dart patterns
- Reference Context7 for BLoC library usage
- Check Context7 for Riverpod best practices
- Query Context7 for Flutter testing strategies

## Best Practices

**DO:**
- Follow Flutter widget composition patterns
- Use const constructors where possible
- Implement proper key usage for lists
- Use async/await for futures
- Separate business logic from UI
- Write widget tests for UI components
- Use riverpod or BLoC for state management

**DON'T:**
- Build large widgets → Break into smaller widgets
- Put business logic in build methods
- Forget to dispose controllers and subscriptions
- Block main thread with sync operations
- Skip error handling in futures
- Use global state unnecessarily
- Ignore widget rebuilds optimization
