import storage from 'redux-persist/lib/storage'; // Default to localStorage
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import createAdminReducers from './slices/createAdminSlice';
import superAdminAuthReducers from './slices/superadminAuthSlice';
import allCompaniesReducers from './slices/companiesListSlice';
import createCompanyReducers from './slices/createCompanySlice';
import deleteCompanyReducers from './slices/deleteCompanySlice';
import companyCustomerReducers from './slices/companyCustomerSlice';
import fetchLocationsReducers from './slices/companyLocationSlice';
import companyOrderReducers from './slices/companyOrderSlice';
import categoriesReducers from './slices/categoriesSlice';
import locationsReducers from './slices/locationsSlice';
import liveCounterMealReducers from './slices/liveCounterMeals';
import repeatingMealReducers from './slices/dailyMealsSlice';
import quickMealReducers from './slices/quickMealSlice';
import allOrdersReducers from './slices/allOrderSlice';
import allBlogsReducers from './slices/allBlogs';

// 🔹 Combine Reducers
const rootReducer = combineReducers({
  createAdmin: createAdminReducers,
  superAdminAuth: superAdminAuthReducers,
  allCompanies: allCompaniesReducers,
  createCompany: createCompanyReducers,
  deleteCompany: deleteCompanyReducers,
  companyCustomer: companyCustomerReducers,
  companyLocations: fetchLocationsReducers,
  companyOrders: companyOrderReducers,
  categories: categoriesReducers,
  allLocations: locationsReducers,
  liveCounterMeals: liveCounterMealReducers,
  repeatingMeals: repeatingMealReducers,
  quickMeals: quickMealReducers,
  allOrders: allOrdersReducers,
  allBlogs: allBlogsReducers,
});

// 🔹 Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Configure the Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

const persistor = persistStore(store);

export { store, persistor };
