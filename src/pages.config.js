/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import API from './pages/API';
import Account from './pages/Account';
import AddressLookup from './pages/AddressLookup';
import Admin from './pages/Admin';
import BatchAnalysis from './pages/BatchAnalysis';
import Comparison from './pages/Comparison';
import Forum from './pages/Forum';
import Pricing from './pages/Pricing';
import SSNLookup from './pages/SSNLookup';
import Skiptrace from './pages/Skiptrace';
import __Layout from './Layout.jsx';

export const PAGES = {
    "API": API,
    "Account": Account,
    "AddressLookup": AddressLookup,
    "Admin": Admin,
    "BatchAnalysis": BatchAnalysis,
    "Comparison": Comparison,
    "Forum": Forum,
    "Pricing": Pricing,
    "SSNLookup": SSNLookup,
    "Skiptrace": Skiptrace,
}

export const pagesConfig = {
    mainPage: "SSNLookup",
    Pages: PAGES,
    Layout: __Layout,
};