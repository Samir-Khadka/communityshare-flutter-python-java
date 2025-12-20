# CSS Styling Guidelines for ToolShare Flutter App

## Overview

This document provides comprehensive styling guidelines for the ToolShare Flutter application, ensuring consistent design, user experience, and brand identity across all platforms.

## Design System

### 1. Color Palette

#### Primary Colors
```css
/* Primary Brand Colors */
:root {
  --primary-green: #2E7D32;        /* Material Green 800 */
  --primary-green-light: #4CAF50;    /* Material Green 500 */
  --primary-green-dark: #1B5E20;     /* Material Green 900 */
  
  --primary-blue: #1976D2;          /* Material Blue 700 */
  --primary-blue-light: #42A5F5;    /* Material Blue 400 */
  --primary-blue-dark: #0D47A1;     /* Material Blue 900 */
}
```

#### Secondary Colors
```css
/* Secondary Colors */
:root {
  --secondary-orange: #FF9800;        /* Material Orange 600 */
  --secondary-red: #F44336;          /* Material Red 500 */
  --secondary-purple: #9C27B0;       /* Material Purple 600 */
  --secondary-teal: #009688;         /* Material Teal 600 */
}
```

#### Neutral Colors
```css
/* Neutral Colors */
:root {
  --background-primary: #FFFFFF;        /* Pure White */
  --background-secondary: #FAFAFA;      /* Material Grey 50 */
  --background-tertiary: #F5F5F5;     /* Material Grey 100 */
  
  --surface-primary: #FFFFFF;           /* Card backgrounds */
  --surface-secondary: #F8F9FA;       /* Hover states */
  --surface-tertiary: #E9ECEF;       /* Disabled states */
  
  --text-primary: #212121;             /* Material Grey 900 */
  --text-secondary: #757575;           /* Material Grey 600 */
  --text-tertiary: #BDBDBD;           /* Material Grey 400 */
  --text-disabled: #E0E0E0;            /* Material Grey 300 */
  
  --border-light: #E0E0E0;             /* Light borders */
  --border-medium: #BDBDBD;            /* Medium borders */
  --border-dark: #757575;              /* Dark borders */
}
```

#### Token System Colors
```css
/* Token Colors */
:root {
  --token-gold: #FFD700;              /* Gold */
  --token-silver: #C0C0C0;            /* Silver */
  --token-bronze: #CD7F32;            /* Bronze */
  --token-diamond: #B9F2FF;           /* Diamond (special) */
}
```

#### Status Colors
```css
/* Status Colors */
:root {
  --status-available: #4CAF50;          /* Green */
  --status-borrowed: #FF9800;          /* Orange */
  --status-unavailable: #F44336;       /* Red */
  --status-pending: #2196F3;           /* Blue */
  --status-completed: #388E3C;         /* Dark Green */
  --status-cancelled: #9E9E9E;         /* Grey */
}
```

### 2. Typography

#### Font Families
```css
/* Font Families */
:root {
  --font-primary: 'Roboto', sans-serif;    /* Material Design font */
  --font-secondary: 'Poppins', sans-serif; /* Modern alternative */
  --font-mono: 'JetBrains Mono', monospace; /* Code/data display */
}
```

#### Font Sizes and Weights
```css
/* Typography Scale */
:root {
  --font-size-xs: 12px;          /* 0.75rem */
  --font-size-sm: 14px;          /* 0.875rem */
  --font-size-base: 16px;        /* 1rem */
  --font-size-lg: 18px;          /* 1.125rem */
  --font-size-xl: 20px;          /* 1.25rem */
  --font-size-2xl: 24px;         /* 1.5rem */
  --font-size-3xl: 32px;         /* 2rem */
  --font-size-4xl: 40px;         /* 2.5rem */
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

#### Text Styles
```css
/* Text Styles */
.text-headline-1 {
  font-family: var(--font-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.text-headline-2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
  letter-spacing: -0.25px;
  color: var(--text-primary);
}

.text-body-large {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
  color: var(--text-primary);
}

.text-body-medium {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
  color: var(--text-primary);
}

.text-body-small {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: 1.4;
  color: var(--text-secondary);
}

.text-caption {
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: 1.3;
  color: var(--text-tertiary);
}
```

### 3. Spacing System

#### Margin and Padding
```css
/* Spacing Scale */
:root {
  --spacing-xs: 4px;            /* 0.25rem */
  --spacing-sm: 8px;            /* 0.5rem */
  --spacing-md: 16px;           /* 1rem */
  --spacing-lg: 24px;           /* 1.5rem */
  --spacing-xl: 32px;           /* 2rem */
  --spacing-2xl: 48px;          /* 3rem */
  --spacing-3xl: 64px;          /* 4rem */
}
```

#### Utility Classes
```css
/* Margin Utilities */
.m-0 { margin: 0; }
.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }

.mt-0 { margin-top: 0; }
.mt-xs { margin-top: var(--spacing-xs); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }

/* Padding Utilities */
.p-0 { padding: 0; }
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.px-sm { padding-left: var(--spacing-sm); padding-right: var(--spacing-sm); }
.py-md { padding-top: var(--spacing-md); padding-bottom: var(--spacing-md); }
```

### 4. Border Radius

```css
/* Border Radius */
:root {
  --radius-xs: 4px;            /* Small elements */
  --radius-sm: 8px;            /* Buttons, inputs */
  --radius-md: 12px;           /* Cards */
  --radius-lg: 16px;           /* Large cards */
  --radius-xl: 24px;           /* Special elements */
  --radius-full: 9999px;        /* Circular elements */
}

.radius-xs { border-radius: var(--radius-xs); }
.radius-sm { border-radius: var(--radius-sm); }
.radius-md { border-radius: var(--radius-md); }
.radius-lg { border-radius: var(--radius-lg); }
.radius-xl { border-radius: var(--radius-xl); }
.radius-full { border-radius: var(--radius-full); }
```

### 5. Shadows

```css
/* Shadow System */
:root {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-xs { box-shadow: var(--shadow-xs); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
```

## Component Styling

### 1. Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-blue) 100%);
  color: var(--background-primary);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
  background: var(--surface-tertiary);
  color: var(--text-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  border-radius: var(--radius-sm);
  padding: calc(var(--spacing-sm) - 2px) calc(var(--spacing-lg) - 2px);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-green);
  color: var(--background-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  color: var(--primary-green);
  background: rgba(46, 125, 50, 0.1);
}
```

### 2. Cards

#### Item Card
```css
.card-item {
  background: var(--surface-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-green-light);
}

.card-item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--surface-tertiary);
}

.card-item-content {
  padding: var(--spacing-md);
}

.card-item-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
}

.card-item-description {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### Profile Card
```css
.card-profile {
  background: var(--surface-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  text-align: center;
  border: 1px solid var(--border-light);
}

.card-profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  border: 3px solid var(--primary-green);
  margin-bottom: var(--spacing-md);
  object-fit: cover;
}

.card-profile-name {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-profile-location {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}
```

### 3. Forms

#### Input Fields
```css
.input-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: var(--surface-primary);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.input-field::placeholder {
  color: var(--text-tertiary);
}

.input-field:disabled {
  background: var(--surface-tertiary);
  color: var(--text-disabled);
  cursor: not-allowed;
}
```

#### Form Labels
```css
.form-label {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  display: block;
}

.form-label-required::after {
  content: " *";
  color: var(--secondary-red);
}
```

### 4. Navigation

#### Bottom Navigation
```css
.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-primary);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-sm) 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: var(--radius-sm);
  min-width: 60px;
}

.nav-item.active {
  color: var(--primary-green);
  background: rgba(46, 125, 50, 0.1);
}

.nav-item:hover {
  color: var(--primary-green);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 24px;
  margin-bottom: var(--spacing-xs);
}

.nav-label {
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
```

#### App Bar
```css
.app-bar {
  background: var(--primary-green);
  color: var(--background-primary);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 999;
}

.app-bar-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--background-primary);
}

.app-bar-actions {
  display: flex;
  gap: var(--spacing-sm);
}
```

## Special Components

### 1. Token Display

#### Token Balance Card
```css
.token-balance-card {
  background: linear-gradient(135deg, var(--token-gold) 0%, var(--token-silver) 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.token-balance-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.token-balance-amount {
  font-family: var(--font-secondary);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-xs);
}

.token-balance-label {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### 2. Status Badges

#### Status Badge
```css
.badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.badge-available {
  background: var(--status-available);
  color: white;
}

.badge-borrowed {
  background: var(--status-borrowed);
  color: white;
}

.badge-unavailable {
  background: var(--status-unavailable);
  color: white;
}

.badge-pending {
  background: var(--status-pending);
  color: white;
}
```

### 3. Rating Stars

#### Star Rating
```css
.rating-stars {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.star {
  font-size: 20px;
  color: var(--rating-empty);
  transition: color 0.3s ease;
}

.star.filled {
  color: var(--rating-full);
}

.star.half-filled {
  position: relative;
  color: var(--rating-empty);
}

.star.half-filled::before {
  content: "★";
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: var(--rating-full);
}

.rating-text {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-left: var(--spacing-sm);
}
```

## Responsive Design

### 1. Breakpoints

```css
/* Breakpoints */
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: 1400px;
}

/* Media Queries */
@media (max-width: 575px) {
  .container {
    padding: var(--spacing-sm);
  }
  
  .card-item {
    margin-bottom: var(--spacing-md);
  }
  
  .nav-bottom {
    padding: var(--spacing-xs) 0;
  }
  
  .nav-item {
    min-width: 50px;
  }
  
  .nav-icon {
    font-size: 20px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .grid-items {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .grid-items {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
  }
}

@media (min-width: 992px) {
  .grid-items {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
  }
}
```

### 2. Container System

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.container-fluid {
  width: 100%;
  padding: 0 var(--spacing-md);
}

.container-sm {
  max-width: 540px;
}

.container-md {
  max-width: 720px;
}

.container-lg {
  max-width: 960px;
}

.container-xl {
  max-width: 1140px;
}
```

## Animation Guidelines

### 1. Transitions

```css
/* Standard Transitions */
.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
```

### 2. Keyframe Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.3s ease forwards;
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Bounce */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
}

.bounce {
  animation: bounce 1s infinite;
}
```

## Dark Mode Support

### 1. Dark Theme Variables

```css
/* Dark Theme */
[data-theme="dark"] {
  --background-primary: #121212;
  --background-secondary: #1E1E1E;
  --background-tertiary: #2D2D2D;
  
  --surface-primary: #1E1E1E;
  --surface-secondary: #2D2D2D;
  --surface-tertiary: #3D3D3D;
  
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-tertiary: #666666;
  --text-disabled: #444444;
  
  --border-light: #3D3D3D;
  --border-medium: #555555;
  --border-dark: #777777;
}
```

### 2. Theme Toggle

```css
.theme-toggle {
  background: var(--surface-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--surface-tertiary);
}

.theme-icon {
  font-size: 20px;
  color: var(--text-primary);
}
```

## Accessibility Guidelines

### 1. Focus States

```css
/* Focus Styles */
.focus-visible:focus {
  outline: 2px solid var(--primary-green);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.focus-visible:focus:not(:focus-visible) {
  outline: none;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .btn-primary {
    border: 3px solid var(--text-primary);
  }
  
  .input-field {
    border-width: 2px;
  }
}
```

### 2. Reduced Motion

```css
/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Optimization

### 1. CSS Optimization

```css
/* Hardware Acceleration */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Contain Paint */
.contain-paint {
  contain: paint;
}

/* Contain Layout */
.contain-layout {
  contain: layout;
}
```

### 2. Image Optimization

```css
/* Lazy Loading Images */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

/* Responsive Images */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

## Flutter Implementation

### 1. Color Constants

```dart
// lib/constants/app_colors.dart
class AppColors {
  // Primary Colors
  static const Color primaryGreen = Color(0xFF2E7D32);
  static const Color primaryGreenLight = Color(0xFF4CAF50);
  static const Color primaryGreenDark = Color(0xFF1B5E20);
  
  static const Color primaryBlue = Color(0xFF1976D2);
  static const Color primaryBlueLight = Color(0xFF42A5F5);
  static const Color primaryBlueDark = Color(0xFF0D47A1);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textTertiary = Color(0xFFBDBDBD);
  
  // Background Colors
  static const Color backgroundPrimary = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFFAFAFA);
  
  // Token Colors
  static const Color tokenGold = Color(0xFFFFD700);
  static const Color tokenSilver = Color(0xFFC0C0C0);
  static const Color tokenBronze = Color(0xFFCD7F32);
  
  // Status Colors
  static const Color statusAvailable = Color(0xFF4CAF50);
  static const Color statusBorrowed = Color(0xFFFF9800);
  static const Color statusUnavailable = Color(0xFFF44336);
  static const Color statusPending = Color(0xFF2196F3);
}
```

### 2. Text Styles

```dart
// lib/constants/app_text_styles.dart
import 'package:flutter/material.dart';

class AppTextStyles {
  static const TextStyle headline1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.2,
  );
  
  static const TextStyle headline2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
    height: 1.3,
  );
  
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    height: 1.5,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: AppColors.textPrimary,
    height: 1.5,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.textSecondary,
    height: 1.4,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.textTertiary,
    height: 1.3,
  );
}
```

### 3. Theme Configuration

```dart
// lib/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryGreen,
        secondary: AppColors.primaryBlue,
        surface: AppColors.backgroundPrimary,
        background: AppColors.backgroundSecondary,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
        onBackground: AppColors.textPrimary,
      ),
      textTheme: const TextTheme(
        headlineLarge: AppTextStyles.headline1,
        headlineMedium: AppTextStyles.headline2,
        bodyLarge: AppTextStyles.bodyLarge,
        bodyMedium: AppTextStyles.bodyMedium,
        bodySmall: AppTextStyles.bodySmall,
        labelSmall: AppTextStyles.caption,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryGreen,
          foregroundColor: Colors.white,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      cardTheme: const CardTheme(
        color: AppColors.backgroundPrimary,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryGreen,
        secondary: AppColors.primaryBlue,
        surface: Color(0xFF1E1E1E),
        background: Color(0xFF121212),
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.white,
        onBackground: Colors.white,
      ),
    );
  }
}
```

This comprehensive styling guide ensures a consistent, accessible, and visually appealing design system for the ToolShare Flutter application across all platforms and devices.