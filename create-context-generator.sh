#!/bin/bash

# Create root directory
mkdir -p context-generator

# Create client-side structure
mkdir -p context-generator/client/public
mkdir -p context-generator/client/src/components/common
mkdir -p context-generator/client/src/components/forms
mkdir -p context-generator/client/src/components/document
mkdir -p context-generator/client/src/pages
mkdir -p context-generator/client/src/services
mkdir -p context-generator/client/src/utils
mkdir -p context-generator/client/src/context
mkdir -p context-generator/client/src/styles

# Create server-side structure
mkdir -p context-generator/server/src/config
mkdir -p context-generator/server/src/controllers
mkdir -p context-generator/server/src/middleware
mkdir -p context-generator/server/src/models
mkdir -p context-generator/server/src/routes
mkdir -p context-generator/server/src/services
mkdir -p context-generator/server/src/utils
mkdir -p context-generator/server/src/prompts

# Create shared directory structure
mkdir -p context-generator/shared/types
mkdir -p context-generator/shared/constants
mkdir -p context-generator/shared/utils

# Create basic files
touch context-generator/client/public/index.html
touch context-generator/client/public/favicon.ico
touch context-generator/client/src/components/common/Header.jsx
touch context-generator/client/src/components/common/Footer.jsx
touch context-generator/client/src/components/common/LoadingSpinner.jsx
touch context-generator/client/src/components/common/ErrorMessage.jsx
touch context-generator/client/src/components/forms/DocumentTypeSelector.jsx
touch context-generator/client/src/components/forms/BusinessInfoForm.jsx
touch context-generator/client/src/components/forms/AudienceForm.jsx
touch context-generator/client/src/components/forms/MarketingGoalsForm.jsx
touch context-generator/client/src/components/forms/ReviewForm.jsx
touch context-generator/client/src/components/document/DocumentPreview.jsx
touch context-generator/client/src/components/document/SectionPreview.jsx
touch context-generator/client/src/components/document/DocumentControls.jsx
touch context-generator/client/src/components/App.jsx
touch context-generator/client/src/components/Routes.jsx
touch context-generator/client/src/pages/HomePage.jsx
touch context-generator/client/src/pages/FormWizardPage.jsx
touch context-generator/client/src/pages/DocumentResultPage.jsx
touch context-generator/client/src/pages/SavedDocumentsPage.jsx
touch context-generator/client/src/services/apiService.js
touch context-generator/client/src/services/documentService.js
touch context-generator/client/src/services/authService.js
touch context-generator/client/src/utils/formValidation.js
touch context-generator/client/src/utils/documentFormatter.js
touch context-generator/client/src/context/AuthContext.jsx
touch context-generator/client/src/context/DocumentContext.jsx
touch context-generator/client/src/styles/global.css
touch context-generator/client/src/styles/forms.css
touch context-generator/client/src/styles/document.css
touch context-generator/client/src/index.js

# Create server files
touch context-generator/server/src/config/default.js
touch context-generator/server/src/config/development.js
touch context-generator/server/src/config/production.js
touch context-generator/server/src/controllers/authController.js
touch context-generator/server/src/controllers/documentController.js
touch context-generator/server/src/controllers/aiController.js
touch context-generator/server/src/middleware/auth.js
touch context-generator/server/src/middleware/errorHandler.js
touch context-generator/server/src/models/User.js
touch context-generator/server/src/models/Document.js
touch context-generator/server/src/routes/authRoutes.js
touch context-generator/server/src/routes/documentRoutes.js
touch context-generator/server/src/services/openaiService.js
touch context-generator/server/src/services/anthropicService.js
touch context-generator/server/src/services/aiServiceFactory.js
touch context-generator/server/src/utils/promptBuilder.js
touch context-generator/server/src/utils/documentProcessor.js
touch context-generator/server/src/prompts/marketAudiencePrompts.js
touch context-generator/server/src/prompts/businessProfilePrompts.js
touch context-generator/server/src/prompts/styleGuidePrompts.js
touch context-generator/server/src/server.js

# Create shared files
touch context-generator/shared/types/document.types.js
touch context-generator/shared/types/user.types.js
touch context-generator/shared/constants/documentTypes.js
touch context-generator/shared/constants/sectionTypes.js
touch context-generator/shared/utils/formatters.js

# Create root files
touch context-generator/.gitignore
touch context-generator/package.json
touch context-generator/README.md

echo "Context generator file structure created successfully!"