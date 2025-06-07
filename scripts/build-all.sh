echo "🏗️  Building Weather Dashboard..."

# Build frontend
echo "⚛️  Building frontend..."
cd apps/frontend
npm run build
cd ../..

# Build backend
echo "🔧 Building backend..."
cd apps/backend
dotnet build --configuration Release
cd ../..

echo "✅ Build complete!"