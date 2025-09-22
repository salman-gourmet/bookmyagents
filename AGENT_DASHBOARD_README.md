# Agent Dashboard System

This document describes the agent dashboard system that allows agents to manage their services in the travel booking application.

## Features

### Agent Dashboard
- **Service Management**: Create, read, update, and delete services
- **Rich Text Editor**: Customizable service descriptions with formatting options
- **Image Management**: Upload and manage multiple service images
- **Statistics**: View service statistics and analytics
- **Filtering**: Search and filter services by category, location, and price

### Service Schema
Each service includes:
- **Basic Information**: Title, description, category, price
- **Contact Details**: Phone, email, address, website
- **Location**: City, state, country, coordinates
- **Images**: Multiple service images
- **Metadata**: Creation and update timestamps

### Categories
- Accommodation
- Transportation
- Tours
- Food & Dining
- Entertainment
- Shopping
- Other

## Components

### 1. AgentRoute (`src/components/common/AgentRoute.tsx`)
- Route protection for agent-only access
- Redirects non-agents to appropriate pages

### 2. AgentDashboard (`src/components/pages/agent/AgentDashboard.tsx`)
- Main dashboard component
- Service listing and management
- Statistics display
- Navigation between views

### 3. ServiceForm (`src/components/forms/ServiceForm.tsx`)
- Rich text editor for service descriptions
- Image upload and preview
- Form validation with Yup schema
- Support for both create and edit modes

### 4. ServiceList (`src/components/common/ServiceList.tsx`)
- Grid display of services
- Image carousel for multiple photos
- Edit and delete actions
- Confirmation modals

### 5. ServiceService (`src/services/serviceService.ts`)
- API service for CRUD operations
- Image upload functionality
- Statistics retrieval
- Agent-specific service filtering

## API Endpoints

The system expects the following API endpoints:

```
POST   /api/services              - Create service
GET    /api/services              - Get all services (with filters)
GET    /api/services/agent/:id    - Get agent's services
GET    /api/services/:id          - Get single service
PUT    /api/services/:id          - Update service
DELETE /api/services/:id          - Delete service
GET    /api/services/stats/agent/:id - Get agent statistics
POST   /api/services/upload-images   - Upload service images
DELETE /api/services/delete-images   - Delete service images
```

## Usage

### Accessing the Agent Dashboard
1. Register/login as an agent (role: 'agent')
2. Navigate to `/agent-dashboard`
3. The system will automatically redirect non-agents

### Creating a Service
1. Click "Create Service" button
2. Fill in the service form:
   - Basic information (title, category, price)
   - Rich text description
   - Upload images
   - Contact details
   - Location information
3. Submit the form

### Managing Services
- **View**: Services are displayed in a responsive grid
- **Edit**: Click edit button to modify service details
- **Delete**: Click delete button and confirm action
- **Filter**: Use search and category filters to find specific services

### Rich Text Editor Features
- Bold, italic, underline formatting
- Bullet and numbered lists
- Real-time preview
- HTML output for storage

## Styling

The agent dashboard uses custom CSS (`src/styles/agent-dashboard.css`) with:
- Modern gradient designs
- Responsive layout
- Hover effects and animations
- Bootstrap integration
- Mobile-friendly design

## Authentication

The system integrates with the existing authentication system:
- Agents must be logged in
- Role-based access control
- Automatic redirects for unauthorized users

## File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── AgentRoute.tsx
│   │   └── ServiceList.tsx
│   ├── forms/
│   │   └── ServiceForm.tsx
│   └── pages/
│       └── agent/
│           └── AgentDashboard.tsx
├── pages/
│   └── AgentDashboardMain.tsx
├── services/
│   └── serviceService.ts
├── styles/
│   └── agent-dashboard.css
└── types/
    └── service.ts
```

## Future Enhancements

- Advanced image editing capabilities
- Service analytics and reporting
- Bulk operations for services
- Service templates
- Integration with external mapping services
- Real-time notifications
- Service approval workflow
