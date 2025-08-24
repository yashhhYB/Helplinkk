# Azure Deployment Guide for HelpLink

## Prerequisites

1. Azure subscription with the following services:
   - Azure Web Apps
   - Azure SQL Database
   - Azure Machine Learning
   - Azure Communication Services
   - Azure Storage Account
   - Azure Active Directory B2C

## Deployment Steps

### 1. Azure SQL Database Setup

```sql
-- Create main tables for HelpLink
CREATE TABLE users (
    id NVARCHAR(50) PRIMARY KEY,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    region NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE patients (
    user_id NVARCHAR(50) PRIMARY KEY,
    blood_type NVARCHAR(5) NOT NULL,
    hla_type NVARCHAR(255),
    medical_history NVARCHAR(MAX),
    emergency_contact NVARCHAR(20),
    preferred_hospital NVARCHAR(255),
    iron_level FLOAT,
    hemoglobin_level FLOAT,
    last_transfusion DATETIME2,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE donors (
    user_id NVARCHAR(50) PRIMARY KEY,
    blood_type NVARCHAR(5) NOT NULL,
    donor_type NVARCHAR(20) NOT NULL,
    last_donation DATETIME2,
    availability_status NVARCHAR(20) DEFAULT 'available',
    total_donations INT DEFAULT 0,
    calls_to_donations_ratio FLOAT DEFAULT 0.0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE blood_requests (
    id NVARCHAR(50) PRIMARY KEY,
    patient_id NVARCHAR(50) NOT NULL,
    blood_type NVARCHAR(5) NOT NULL,
    units_required INT NOT NULL,
    urgency NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending',
    request_date DATETIME2 DEFAULT GETDATE(),
    required_by DATETIME2,
    hospital NVARCHAR(255),
    notes NVARCHAR(MAX),
    fulfilled_by NVARCHAR(20),
    donor_id NVARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (donor_id) REFERENCES users(id)
);
```

### 2. Azure Machine Learning Model Deployment

```python
# Azure ML training script for donor availability prediction
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from azureml.core import Workspace, Experiment, Dataset
from azureml.core.model import Model

# Load and preprocess hackathon data
def train_donor_model():
    # Load Hackathon Data.csv
    data = pd.read_csv('hackathon_data.csv')
    
    # Feature engineering
    features = ['calls_to_donations_ratio', 'total_donations', 'days_since_last_donation', 'donor_type_encoded']
    X = data[features]
    y = data['responded_to_request']  # Target variable
    
    # Train model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Register model
    model_name = 'donor-availability-prediction'
    Model.register(workspace=ws, model_path='./model', model_name=model_name)
    
    return model
```

### 3. Environment Variables for Azure App Service

```bash
# Database
AZURE_SQL_SERVER=helplink-server.database.windows.net
AZURE_SQL_DATABASE=helplink-db
AZURE_SQL_USER=helplink-admin
AZURE_SQL_PASSWORD=your-secure-password

# Azure ML
AZURE_ML_ENDPOINT=https://helplink-ml.azureml.net
AZURE_ML_KEY=your-ml-key
AZURE_ML_WORKSPACE=helplink-ml-workspace

# Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=your-connection-string
AZURE_EMAIL_DOMAIN=helplink.azurecomm.net
AZURE_SMS_NUMBER=+1-555-HELPLINK

# Storage
AZURE_STORAGE_ACCOUNT=helplinkStorage
AZURE_STORAGE_KEY=your-storage-key

# Security
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### 4. Azure Web App Configuration

```json
{
  "name": "helplink-app",
  "location": "East US",
  "sku": "B1",
  "linuxFxVersion": "NODE|18-lts",
  "appSettings": [
    {
      "name": "WEBSITE_NODE_DEFAULT_VERSION",
      "value": "18.17.0"
    },
    {
      "name": "SCM_DO_BUILD_DURING_DEPLOYMENT",
      "value": "true"
    }
  ]
}
```

### 5. Deployment Commands

```bash
# Build the application
npm run build

# Deploy to Azure Web App using Azure CLI
az webapp up --sku B1 --name helplink-app --resource-group helplink-rg

# Configure custom domain (optional)
az webapp config hostname add --webapp-name helplink-app --resource-group helplink-rg --hostname helplink.yourdomain.com
```

## Post-Deployment Configuration

1. Configure SSL certificate
2. Set up Application Insights for monitoring
3. Configure backup and disaster recovery
4. Set up Azure DevOps for CI/CD pipeline
5. Configure auto-scaling rules
6. Set up monitoring alerts

## Security Considerations

- Enable Azure AD B2C for authentication
- Configure WAF rules for API protection
- Set up Key Vault for sensitive data
- Enable diagnostic logging
- Configure CORS policies
- Implement rate limiting

## Monitoring & Analytics

- Application Insights for performance monitoring
- Azure Monitor for infrastructure monitoring
- Custom dashboards for business metrics
- Alerts for critical system events