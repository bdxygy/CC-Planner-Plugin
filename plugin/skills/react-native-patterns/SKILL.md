---
name: React Native Patterns
description: This skill should be used when the user asks to "plan a React Native app", "design React Native architecture", "create React Native components", mentions React Native development, or refers to React Navigation, Hooks, or cross-platform mobile development. Provides comprehensive React Native architecture patterns.
version: 0.1.0
---

# React Native Patterns

React Native enables building native mobile apps using React and JavaScript/TypeScript. This skill provides architecture patterns for building testable, maintainable React Native applications following React best practices while addressing mobile-specific concerns.

## Core React Native Principles

**Component Architecture:**

- Functional components with hooks
- Reusable, composable component design
- Platform-specific code handling (Platform OS)
- Native module integration when needed

**Architecture Guidelines:**

- Follow React principles (unidirectional flow, composition)
- Separate concerns (presentation, business logic, data)
- Implement proper state management (Context, Redux, Zustand)
- Handle mobile-specific features (navigation, permissions, sensors)
- Use TypeScript for type safety

**Testability:**

- Component tests with React Native Testing Library
- Unit tests for hooks and business logic
- E2E tests with Detox
- Mock native modules for testing

## React Native Architecture Layers

### Presentation Layer

**Responsibilities:**

- Display components and handle user interaction
- Manage component-local state with hooks
- Consume data from state management
- Handle navigation

**Structure:**

```
src/
  components/
    common/
      Button.tsx
      Card.tsx
      Loading.tsx
    features/
      ProductCard.tsx
      SearchBar.tsx
  screens/
    HomeScreen.tsx
    DetailScreen.tsx
    navigation/
      AppNavigator.tsx
      TabNavigator.tsx
  hooks/
    useProducts.ts
    useAuth.ts
  context/
    AppContext.tsx
```

### Business Logic Layer

**Responsibilities:**

- Custom hooks for feature logic
- State management (stores, contexts, reducers)
- Use cases / services
- API clients

**Structure:**

```
src/
  store/
    slices/
      productsSlice.ts
      authSlice.ts
    index.ts
  services/
    api/
      apiClient.ts
      endpoints.ts
    products/
      productService.ts
  hooks/
    api/
      useProducts.ts
      useMutation.ts
```

### Data Layer

**Responsibilities:**

- Data models and DTOs
- Local storage (AsyncStorage, SQLite, Realm)
- Network requests
- Data transformation and caching

**Structure:**

```
src/
  models/
    Product.ts
    User.ts
  storage/
    asyncStorage.ts
    secureStore.ts
  api/
    transformers.ts
    validators.ts
```

## Component Patterns

### Functional Components with Hooks

**Screen component:**

```tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export const HomeScreen: React.FC = () => {
  const { products, loading, error, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => navigateToDetail(item.id)} />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>No products found</Text>
        </View>
      }
    />
  );
};
```

**Reusable component:**

```tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 200,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
});
```

## Custom Hooks

**Data fetching hook:**

```tsx
import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, loadProducts };
};
```

**Hook with React Query (Recommended):**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productService.addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

## State Management Patterns

### Context API (Simple apps)

**Context creation:**

```tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface State {
  products: Product[];
  cart: CartItem[];
  user: User | null;
}

type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'SET_USER'; payload: User | null };

const AppContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    products: [],
    cart: [],
    user: null,
  });

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

### Redux Toolkit (Complex apps)

**Slice definition:**

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = productsSlice.actions;
export default productsSlice.reducer;
```

**Thunk for async actions:**

```tsx
import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services/productService';

export const fetchProducts = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    return await productService.getProducts();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
  }
});
```

**Component usage:**

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';

export const HomeScreen: React.FC = () => {
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Render based on state
};
```

### Zustand (Modern alternative)

**Store creation:**

```tsx
import create from 'zustand';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productService.getProducts();
      set({ products, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## Navigation Patterns

### React Navigation (Standard)

**Stack navigator:**

```tsx
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.product?.name })}
      />
    </Stack.Navigator>
  );
};
```

**Tab navigator:**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="cart" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
```

**Navigation with params:**

```tsx
// Navigate
navigation.navigate('Detail', { productId: '123' });

// Receive params
const { productId } = route.params;
```

## Platform-Specific Code

**Platform module:**

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

// Platform-specific component
const PlatformButton = Platform.select({
  ios: () => require('./IOSButton').default,
  android: () => require('./AndroidButton').default,
})();
```

## Testing Scenarios

### Frontend Testing Scenarios (User-Centric)

**Happy Path:**

- User opens app → Home screen displays correctly
- User taps product → Navigates to detail with correct product
- User scrolls list → FlatList scrolls smoothly
- User searches → Search results update and display
- User navigates back → Previous screen restores state

**Edge Cases:**

- Empty product list → ListEmptyComponent displays helpful message
- Single product → Displays correctly
- Large list → FlatList lazy loads efficiently
- Rapid scrolling → No jank, 60fps maintained
- Different screen sizes → Layout adapts responsively

**Failure States:**

- Network error → Error message displays with retry
- Server error (5xx) → User-friendly error, retry available
- Timeout → Loading indicator with timeout message
- Authentication error → Redirect to login
- Malformed data → Graceful fallback, error logging

### Backend Testing Cases (Logic-Driven)

**Hook Tests:**

- Initial state → Returns correct default values
- Success response → State updates with data
- Error response → Error state set correctly
- Loading state → Loading toggles correctly
- Cleanup → Effects clean up properly

**Service Tests:**

- API calls → Fetch returns correct data
- Error handling → HTTP errors map correctly
- Data transformation → JSON maps to models
- Caching → Cache strategy works

**Component Tests:**

- Render → Component renders without crashing
- Props → Component handles prop changes
- User interaction → onPress handlers fire correctly
- Platform differences → iOS and Android specific code works

## Context7 Integration

For React Native-specific documentation:

- Use Context7 for React Navigation API
- Query Context7 for React Native Testing Library
- Reference Context7 for React Query hooks
- Check Context7 for latest React Native patterns
- Query Context7 for native module development

## Best Practices

**DO:**

- Use functional components with hooks
- Implement proper TypeScript types
- Use React Query for server state
- Handle loading, error, and empty states
- Implement proper navigation structure
- Write tests for components and hooks
- Platform-specific code when needed

**DON'T:**

- Use class components (use hooks instead)
- Put business logic in components (use hooks/services)
- Forget cleanup in useEffect
- Block JS thread with heavy computations
- Skip error boundaries
- Ignore accessibility (a11y)
- Use inline styles (use StyleSheet)
