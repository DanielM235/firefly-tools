# Category Importer Tool

## 📋 **Overview**

The Category Importer tool allows you to bulk import categories from JSON files into your Firefly III instance via the API.

## 🏗️ **Features**

- **Automatic Discovery**: Scans `data/categories/` directory for JSON files
- **Multiple Language Support**: Ready for different language category sets
- **Safe Import**: Rate limiting and error handling to protect your API
- **Professional Logging**: Detailed progress and error reporting
- **Validation**: Ensures category data is valid before import

## 📁 **File Structure**

```
data/categories/
├── categories-pt-br.json    # Portuguese (Brazil) categories
├── categories-en.json       # English categories (future)
├── categories-fr.json       # French categories (future)
└── categories-es.json       # Spanish categories (future)
```

## 📝 **JSON File Format**

Category files should contain an array of category objects:

```json
[
  {
    "name": "[🏠 Despesas Domésticas] Supermercado",
    "notes": "Alimentos e produtos domésticos"
  },
  {
    "name": "[🚗 Transporte] Combustível",
    "notes": "Gasolina, etanol"
  }
]
```

### Required Fields:
- `name` (string): The category name
- `notes` (string, optional): Description or notes for the category

## 🚀 **Usage**

### Prerequisites:
1. **Configuration**: Ensure your Firefly III API is configured
2. **Permissions**: Tool needs read, environment, and network access
3. **Category Files**: Place JSON files in `data/categories/` directory

### Running the Tool:

```bash
# Direct execution
deno run --allow-read --allow-env --allow-net src/tools/category-importer.ts

# Using the example wrapper
deno run --allow-read --allow-env --allow-net examples/import-categories.ts
```

## ⚙️ **Configuration**

The tool uses the same configuration as other Firefly III tools:

### Via Configuration File:
```json
{
  "firefly": {
    "baseUrl": "https://your-firefly-instance.com",
    "apiToken": "your-personal-access-token"
  }
}
```

### Via Environment Variables:
```bash
export FIREFLY_BASE_URL="https://your-firefly-instance.com"
export FIREFLY_API_TOKEN="your-personal-access-token"
```

## 📊 **Import Process**

1. **Discovery**: Scans for available category files
2. **Selection**: Automatically selects file if only one exists
3. **Validation**: Validates JSON format and required fields
4. **Connection**: Tests API connection before starting import
5. **Import**: Creates categories one by one with rate limiting
6. **Reporting**: Provides detailed success/error summary

## 📈 **Sample Output**

```
🏷️  Firefly III Category Importer
=================================

🔧 Loading configuration...
✅ Configuration loaded
🔗 Connecting to Firefly III API...
✅ API connection successful
📁 Scanning for category files...
📁 Found 1 category file(s)
📁 Using only available file: categories-pt-br
📋 Loading categories from file...
📋 Loaded 34 categories

🚀 Starting import of 34 categories...
📝 Creating: [🏠 Despesas Domésticas] Supermercado
✅ Created: [🏠 Despesas Domésticas] Supermercado
...

📊 Import Summary:
  ✅ Created: 34
  ❌ Errors: 0
  📋 Total: 34
🎉 All categories imported successfully!
```

## 🔧 **Rate Limiting**

The tool includes built-in rate limiting:
- **100ms delay** between category creations
- **API retry logic** for failed requests
- **Connection testing** before starting import

## ⚠️ **Important Notes**

### Duplicate Categories:
- Firefly III may reject categories with duplicate names
- The tool will log errors for any failed imports
- Check your existing categories before importing

### API Permissions:
- Requires a Personal Access Token with category creation permissions
- Token must be valid and not expired

### Data Validation:
- JSON files must contain valid arrays
- Each category must have a `name` field
- Empty or invalid entries will cause import to fail

## 🌍 **Localization**

### Portuguese (Brazil) - `categories-pt-br.json`
Includes comprehensive categories for Brazilian users:
- 🏠 **Despesas Domésticas** (Household Expenses)
- 🚗 **Transporte** (Transportation)
- ❤️ **Saúde** (Health)
- 🎓 **Educação** (Education)
- 🎉 **Lazer e Cultura** (Leisure & Culture)
- 📈 **Financeiro** (Financial)
- 🎁 **Presentes e Doações** (Gifts & Donations)
- 🌱 **Desenvolvimento Pessoal** (Personal Development)

### Adding New Languages:
1. Create a new JSON file in `data/categories/`
2. Follow the same format as existing files
3. Use appropriate emoji prefixes for visual organization
4. Include relevant notes in the target language

## 🔍 **Troubleshooting**

### Common Issues:

**API Connection Failed**
- Check your base URL and API token
- Verify Firefly III instance is accessible
- Test with: `curl -H "Authorization: Bearer YOUR_TOKEN" YOUR_URL/api/v1/about`

**Categories Not Created**
- Check Firefly III logs for detailed error messages
- Verify token permissions include category management
- Look for duplicate category names

**File Not Found**
- Ensure JSON files are in `data/categories/` directory
- Check file permissions and accessibility
- Verify JSON syntax is valid

## 📚 **Related Documentation**

- [Firefly III API Documentation](https://api-docs.firefly-iii.org/#/categories)
- [Configuration Guide](../CONFIGURATION.md)
- [Development Guide](../DEVELOPMENT.md)
