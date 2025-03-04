#!/bin/bash

# Create root directory
mkdir -p contextforge

# Create client-side structure
mkdir -p contextforge/client/public
mkdir -p contextforge/client/src/components/common
mkdir -p contextforge/client/src/components/forms
mkdir -p contextforge/client/src/components/document
mkdir -p contextforge/client/src/pages
mkdir -p contextforge/client/src/services
mkdir -p contextforge/client/src/utils
mkdir -p contextforge/client/src/context
mkdir -p contextforge/client/src/styles

# Create server-side structure
mkdir -p contextforge/server/src/config
mkdir -p contextforge/server/src/controllers
mkdir -p contextforge/server/src/middleware
mkdir -p contextforge/server/src/models
mkdir -p contextforge/server/src/routes
mkdir -p contextforge/server/src/services
mkdir -p contextforge/server/src/utils
mkdir -p contextforge/server/src/prompts

# Create shared directory structure
mkdir -p contextforge/shared/types
mkdir -p contextforge/shared/constants
mkdir -p contextforge/shared/utils

# Create basic files
touch contextforge/client/public/index.html
touch contextforge/client/public/favicon.ico
touch contextforge/client/src/components/common/Header.jsx
touch contextforge/client/src/components/common/Footer.jsx
touch contextforge/client/src/components/common/LoadingSpinner.jsx
touch contextforge/client/src/components/common/ErrorMessage.jsx
touch contextforge/client/src/components/forms/DocumentTypeSelector.jsx
touch contextforge/client/src/components/forms/BusinessInfoForm.jsx
touch contextforge/client/src/components/forms/AudienceForm.jsx
touch contextforge/client/src/components/forms/MarketingGoalsForm.jsx
touch contextforge/client/src/components/forms/ReviewForm.jsx
touch contextforge/client/src/components/document/DocumentPreview.jsx
touch contextforge/client/src/components/document/SectionPreview.jsx
touch contextforge/client/src/components/document/DocumentControls.jsx
touch contextforge/client/src/components/App.jsx
touch contextforge/client/src/components/Routes.jsx
touch contextforge/client/src/pages/HomePage.jsx
touch contextforge/client/src/pages/FormWizardPage.jsx
touch contextforge/client/src/pages/DocumentResultPage.jsx
touch contextforge/client/src/pages/SavedDocumentsPage.jsx
touch contextforge/client/src/services/apiService.js
touch contextforge/client/src/services/documentService.js
touch contextforge/client/src/services/authService.js
touch contextforge/client/src/utils/formValidation.js
touch contextforge/client/src/utils/documentFormatter.js
touch contextforge/client/src/context/AuthContext.jsx
touch contextforge/client/src/context/DocumentContext.jsx
touch contextforge/client/src/styles/global.css
touch contextforge/client/src/styles/forms.css
touch contextforge/client/src/styles/document.css
touch contextforge/client/src/index.js

# Create server files
touch contextforge/server/src/config/default.js
touch contextforge/server/src/config/development.js
touch contextforge/server/src/config/production.js
touch contextforge/server/src/controllers/authController.js
touch contextforge/server/src/controllers/documentController.js
touch contextforge/server/src/controllers/aiController.js
touch contextforge/server/src/middleware/auth.js
touch contextforge/server/src/middleware/errorHandler.js
touch contextforge/server/src/models/User.js
touch contextforge/server/src/models/Document.js
touch contextforge/server/src/routes/authRoutes.js
touch contextforge/server/src/routes/documentRoutes.js
touch contextforge/server/src/services/openaiService.js
touch contextforge/server/src/services/anthropicService.js
touch contextforge/server/src/services/aiServiceFactory.js
touch contextforge/server/src/utils/promptBuilder.js
touch contextforge/server/src/utils/documentProcessor.js
touch contextforge/server/src/prompts/marketAudiencePrompts.js
touch contextforge/server/src/prompts/businessProfilePrompts.js
touch contextforge/server/src/prompts/styleGuidePrompts.js
touch contextforge/server/src/server.js

# Create shared files
touch contextforge/shared/types/document.types.js
touch contextforge/shared/types/user.types.js
touch contextforge/shared/constants/documentTypes.js
touch contextforge/shared/constants/sectionTypes.js
touch contextforge/shared/utils/formatters.js

# Create root files
touch contextforge/.gitignore
touch contextforge/package.json
touch contextforge/README.md

echo "ContextForge file structure created successfully!"