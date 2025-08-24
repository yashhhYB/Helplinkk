# Azure Deployment Guide for HelpLink

## Prerequisites

1. **Azure Subscription** with the following services:
   - Azure Static Web Apps
   - Azure OpenAI Service
   - Azure Machine Learning
   - Azure Communication Services
   - Azure Storage Account
   - Azure Active Directory B2C

2. **Development Tools**:
   - Azure CLI installed
   - Node.js 18+ installed
   - Git repository setup

## Step 1: Azure Resource Setup

### 1.1 Create Resource Group
```bash
az group create --name helplink-rg --location "East US"
```

### 1.2 Create Azure Static Web App
```bash
az staticwebapp create \
  --name helplink-app \
  --resource-group helplink-rg \
  --source https://github.com/your-username/helplink \
  --location "East US2" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### 1.3 Create Azure OpenAI Service
```bash
az cognitiveservices account create \
  --name helplink-openai \
  --resource-group helplink-rg \
  --kind OpenAI \
  --sku S0 \
  --location "East US" \
  --custom-domain helplink-openai
```

### 1.4 Deploy GPT-4 Model
```bash
az cognitiveservices account deployment create \
  --name helplink-openai \
  --resource-group helplink-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --scale-settings-scale-type "Standard"
```

### 1.5 Create Azure ML Workspace
```bash
az ml workspace create \
  --name helplink-ml-workspace \
  --resource-group helplink-rg \
  --location "East US"
```

### 1.6 Create Communication Services
```bash
az communication create \
  --name helplink-communication \
  --resource-group helplink-rg \
  --location "Global"
```

### 1.7 Create Storage Account
```bash
az storage account create \
  --name helplinkStorage \
  --resource-group helplink-rg \
  --location "East US" \
  --sku Standard_LRS
```

## Step 2: Environment Configuration

### 2.1 Get Service Keys
```bash
# Get OpenAI API Key
az cognitiveservices account keys list \
  --name helplink-openai \
  --resource-group helplink-rg

# Get Communication Services Connection String
az communication list-key \
  --name helplink-communication \
  --resource-group helplink-rg

# Get Storage Account Key
az storage account keys list \
  --account-name helplinkStorage \
  --resource-group helplink-rg
```

### 2.2 Configure Static Web App Settings
```bash
az staticwebapp appsettings set \
  --name helplink-app \
  --setting-names \
    VITE_AZURE_OPENAI_ENDPOINT="https://helplink-openai.openai.azure.com/" \
    VITE_AZURE_OPENAI_API_KEY="your-openai-key" \
    VITE_AZURE_ML_ENDPOINT="https://helplink-ml-workspace.azureml.net" \
    VITE_AZURE_COMMUNICATION_CONNECTION_STRING="your-connection-string" \
    VITE_SUPABASE_URL="https://pwtkpynzhworijxnbpjq.supabase.co" \
    VITE_SUPABASE_ANON_KEY="your-supabase-key" \
    VITE_ELEVENLABS_API_KEY="sk_c695c172f85b5ee8d15f4ea2cc3a308f445d626f3ac60a2b" \
    VITE_ELEVENLABS_AGENT_ID="agent_1501k0xj8m74frerhmb25p95eaqk" \
    VITE_GOOGLE_MAPS_API_KEY="AIzaSyAq4zQcQ1B4vdmZL5suv63IY703bh_whPU"
```

## Step 3: Deploy Machine Learning Models

### 3.1 Donor Availability Prediction Model
```python
# donor_prediction_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load training data
data = pd.read_csv('donor_training_data.csv')

# Features: calls_to_donations_ratio, total_donations, days_since_last_donation, donor_type
X = data[['calls_ratio', 'total_donations', 'days_since', 'donor_type_encoded']]
y = data['responded']  # Target: 1 if responded, 0 if not

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'donor_availability_model.pkl')
print(f"Model accuracy: {model.score(X_test, y_test):.3f}")
```

### 3.2 Deploy Model to Azure ML
```bash
# Create model deployment
az ml model create \
  --name donor-availability-model \
  --version 1 \
  --path ./donor_availability_model.pkl \
  --workspace-name helplink-ml-workspace \
  --resource-group helplink-rg

# Create endpoint
az ml online-endpoint create \
  --name donor-prediction-endpoint \
  --workspace-name helplink-ml-workspace \
  --resource-group helplink-rg
```

### 3.3 Blood Demand Forecasting Model
```python
# blood_demand_model.py
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

# Create synthetic training data for blood demand
def create_training_data():
    dates = pd.date_range('2020-01-01', '2023-12-31', freq='D')
    data = []
    
    for date in dates:
        # Seasonal patterns
        month = date.month
        day_of_week = date.weekday()
        
        # Base demand varies by season
        base_demand = 50 + 20 * np.sin(2 * np.pi * month / 12)
        
        # Weekend effect
        weekend_effect = -10 if day_of_week >= 5 else 0
        
        # Random variation
        noise = np.random.normal(0, 5)
        
        demand = max(0, base_demand + weekend_effect + noise)
        
        data.append({
            'date': date,
            'month': month,
            'day_of_week': day_of_week,
            'demand': demand
        })
    
    return pd.DataFrame(data)

# Train model
df = create_training_data()
X = df[['month', 'day_of_week']]
y = df['demand']

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, 'blood_demand_model.pkl')
```

## Step 4: Configure Custom Domain (Optional)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name helplink-app \
  --hostname helplink.yourdomain.com
```

## Step 5: Set up Monitoring

### 5.1 Application Insights
```bash
az monitor app-insights component create \
  --app helplink-insights \
  --location "East US" \
  --resource-group helplink-rg \
  --application-type web
```

### 5.2 Configure Alerts
```bash
# Create alert for high error rate
az monitor metrics alert create \
  --name "High Error Rate" \
  --resource-group helplink-rg \
  --scopes /subscriptions/{subscription-id}/resourceGroups/helplink-rg/providers/Microsoft.Web/staticSites/helplink-app \
  --condition "avg exceptions/requests > 0.1" \
  --description "Alert when error rate exceeds 10%"
```

## Step 6: Security Configuration

### 6.1 Configure CORS
```bash
az staticwebapp cors set \
  --name helplink-app \
  --allowed-origins "https://helplink.yourdomain.com" \
  --allowed-methods "GET,POST,PUT,DELETE" \
  --allowed-headers "*"
```

### 6.2 Set up Authentication (Optional)
```bash
# Configure Azure AD B2C
az staticwebapp identity assign \
  --name helplink-app \
  --resource-group helplink-rg
```

## Step 7: Deployment Commands

### 7.1 Manual Deployment
```bash
# Build the application
npm run build:azure

# Deploy to Azure
az staticwebapp deploy \
  --name helplink-app \
  --resource-group helplink-rg \
  --source ./dist
```

### 7.2 Automated Deployment
The included `azure-deploy.yml` workflow will automatically deploy when you push to the main branch.

## Step 8: Post-Deployment Verification

1. **Test the application**: Visit your Azure Static Web App URL
2. **Verify AI services**: Test the chatbot and health analyzer
3. **Check monitoring**: Ensure Application Insights is collecting data
4. **Test notifications**: Verify email/SMS functionality

## Troubleshooting

### Common Issues:

1. **Build failures**: Check environment variables are set correctly
2. **API errors**: Verify Azure service endpoints and keys
3. **CORS issues**: Ensure allowed origins are configured
4. **Performance**: Monitor Application Insights for bottlenecks

### Useful Commands:

```bash
# View deployment logs
az staticwebapp logs show --name helplink-app

# Check app settings
az staticwebapp appsettings list --name helplink-app

# Restart the app
az staticwebapp restart --name helplink-app
```

## Cost Optimization

1. **Use appropriate pricing tiers** for each service
2. **Set up budget alerts** to monitor costs
3. **Configure auto-scaling** based on usage patterns
4. **Regular cleanup** of unused resources

Your HelpLink application is now ready for production deployment on Azure with full AI/ML capabilities!