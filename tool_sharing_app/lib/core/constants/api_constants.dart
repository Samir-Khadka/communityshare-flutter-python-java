class ApiConstants {
  // Base URLs
  static const String pythonApiBaseUrl = 'https://api.toolshare.app';
  static const String javaTokenServiceUrl = 'https://tokens.toolshare.app';
  static const String firebaseFunctionsUrl = 'https://us-central1-toolshare-app.cloudfunctions.net';
  
  // API Endpoints - Python Backend
  static const String authEndpoint = '/auth';
  static const String usersEndpoint = '/users';
  static const String itemsEndpoint = '/items';
  static const String transactionsEndpoint = '/transactions';
  static const String messagesEndpoint = '/messages';
  static const String reviewsEndpoint = '/reviews';
  static const String notificationsEndpoint = '/notifications';
  static const String searchEndpoint = '/search';
  static const String locationEndpoint = '/location';
  
  // Token Service Endpoints - Java Backend
  static const String tokenBalanceEndpoint = '/balance';
  static const String tokenTransactionEndpoint = '/transaction';
  static const String tokenHistoryEndpoint = '/history';
  static const String tokenValidationEndpoint = '/validate';
  static const String tokenDistributionEndpoint = '/distribute';
  static const String tokenAuditEndpoint = '/audit';
  
  // HTTP Headers
  static const String contentTypeHeader = 'Content-Type';
  static const String authorizationHeader = 'Authorization';
  static const String acceptHeader = 'Accept';
  static const String userAgentHeader = 'User-Agent';
  
  // Header Values
  static const String jsonContentType = 'application/json';
  static const String formContentType = 'application/x-www-form-urlencoded';
  static const String multipartContentType = 'multipart/form-data';
  
  // API Versions
  static const String apiVersion = 'v1';
  static const String apiVersionHeader = 'API-Version';
  
  // Timeouts
  static const int connectionTimeoutSeconds = 30;
  static const int receiveTimeoutSeconds = 30;
  static const int sendTimeoutSeconds = 30;
  
  // Retry Configuration
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 1);
  
  // Rate Limiting
  static const int maxRequestsPerMinute = 60;
  static const int maxRequestsPerHour = 1000;
  
  // Pagination
  static const String pageParameter = 'page';
  static const String limitParameter = 'limit';
  static const String sortParameter = 'sort';
  static const String orderParameter = 'order';
  
  // Filter Parameters
  static const String categoryParameter = 'category';
  static const String locationParameter = 'location';
  static const String radiusParameter = 'radius';
  static const String statusParameter = 'status';
  static const String dateParameter = 'date';
  
  // Response Codes
  static const int successCode = 200;
  static const int createdCode = 201;
  static const int noContentCode = 204;
  static const int badRequestCode = 400;
  static const int unauthorizedCode = 401;
  static const int forbiddenCode = 403;
  static const int notFoundCode = 404;
  static const int conflictCode = 409;
  static const int tooManyRequestsCode = 429;
  static const int internalServerErrorCode = 500;
  static const int serviceUnavailableCode = 503;
  
  // Error Response Keys
  static const String errorKey = 'error';
  static const String messageKey = 'message';
  static const String detailsKey = 'details';
  static const String codeKey = 'code';
  
  // Success Response Keys
  static const String dataKey = 'data';
  static const String userKey = 'user';
  static const String itemsKey = 'items';
  static const String transactionsKey = 'transactions';
  static const String messagesKey = 'messages';
  static const String reviewsKey = 'reviews';
  static const String tokensKey = 'tokens';
  
  // Authentication
  static const String grantTypeParameter = 'grant_type';
  static const String refreshTokenParameter = 'refresh_token';
  static const String accessTokenParameter = 'access_token';
  static const String tokenTypeParameter = 'token_type';
  static const String expiresInParameter = 'expires_in';
  
  // File Upload
  static const String fileParameter = 'file';
  static const String filenameParameter = 'filename';
  static const String mimeTypeParameter = 'mime_type';
  
  // WebSockets
  static const String chatWebSocketUrl = 'wss://chat.toolshare.app/ws';
  static const String notificationWebSocketUrl = 'wss://notifications.toolshare.app/ws';
  
  // External APIs
  static const String googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  static const String googlePlacesApiUrl = 'https://maps.googleapis.com/maps/api/place';
  static const String googleGeocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode';
  static const String stripeApiUrl = 'https://api.stripe.com/v1';
  
  // Security
  static const String apiKeyHeader = 'X-API-Key';
  static const String timestampHeader = 'X-Timestamp';
  static const String signatureHeader = 'X-Signature';
  static const String nonceHeader = 'X-Nonce';
  
  // Monitoring
  static const String traceIdHeader = 'X-Trace-ID';
  static const String sessionIdHeader = 'X-Session-ID';
  static const String requestIdHeader = 'X-Request-ID';
}