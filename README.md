# WBInform

**WBInform** is a marketing platform for automating communication with customers of an online store (integration with Wildberries).  
The system allows you to create and manage email/SMS mailings at different stages of the order lifecycle.

---

## Key Features

### 1. Automated notification system  
**Description:** Automatically sends messages to customers based on order statuses.  
The system controls duplication to avoid duplicate sends and not to overburden customers.

---

### 2. Message Builder  
**Description:** Convenient visual interface for creating messages with support for multichannel sending:  
**SMS / WhatsApp / Telegram**.  
You can use templates with dynamic variables: `{NAME}`, `{ ORDER NUMBER}`, `{Link}`, `{BRAND}`, `{ARTICLE}`, etc.  
Automatic calculation of SMS length and cost is also available.

---

### 3. API Key Manager  
**Description:** Visual interface for managing API keys:  
- Centralized and secure storage  
- Quick access and control  
- Work with multiple keys at the same time

---

### 4. Campaign Management
**Description:** 
Mass Mailing Control Panel:
- View all active and completed campaigns  
- Filtering by status (active / completed / suspended)  
- Control launch and completion dates  
- Quickly edit and stop mailings

---

## Technical Features

- Frontend: Vue.js + Vuetify  
- State: Vuex
- Flexible data filtering system  
- Support for dynamic variable substitution in message templates

---

## Target audience

- Online store marketers  
- Wildberries business owners  
- SMM specialists and agencies

---

## Benefits

- Automate routine notifications  
- Personalized communication  
- Increase customer loyalty  
- Increase feedback  
- Save team time

---

## Needs to be finalized

- Integration with Wildberries API (in full)  
- SMS gateway connection setup  
- Campaign performance analytics system  
- A/B-testing of message templates

---

## Project installation

````bash
npm install
````

## Start the project
````bash
npm run serve
```
