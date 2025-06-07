using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace WeatherDashboard.Functions.Configuration
{
    public class RedisConfiguration
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;
        private ConnectionMultiplexer? _connection;
        private IDatabase? _database;

        public RedisConfiguration(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        /// <summary>
        /// Initialize the connection to Redis in a simple way
        /// </summary>
        public async Task<bool> InitializeAsync()
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
            {
                _logger.LogWarning("Redis connection string not configured. Cache disabled.");
                return false;
            }

            try
            {
                var options = ConfigurationOptions.Parse(_connectionString);
                options.AbortOnConnectFail = false;
                options.ConnectTimeout = 5000; // 5 seconds
                options.SyncTimeout = 5000;

                _connection = await ConnectionMultiplexer.ConnectAsync(options);
                _database = _connection.GetDatabase();

                // Basic connection test
                await _database.PingAsync();

                _logger.LogInformation("Redis cache connected successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to Redis");
                return false;
            }
        }

        /// <summary>
        /// Gets the Redis database instance
        /// </summary>
        public IDatabase? GetDatabase() => _database;

        /// <summary>
        /// Checks if Redis is available
        /// </summary>
        public async Task<bool> IsHealthyAsync()
        {
            try
            {
                if (_database == null || _connection?.IsConnected != true)
                    return false;

                var ping = await _database.PingAsync();
                return ping.TotalMilliseconds < 1000;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Closes the connection
        /// </summary>
        public async Task DisposeAsync()
        {
            if (_connection != null)
            {
                await _connection.DisposeAsync();
                _connection = null;
                _database = null;
            }
        }
    }
}
