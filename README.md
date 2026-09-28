## Colors Web Project

A full-stack LAMP web application developed for **COP 4331**. The platform provides secure user authentication and personalized color management, enabling authenticated users to dynamically add and search for color records tied to their unique account ID.

---

## Features

- **User Authentication:** Credential validation and session handling via backend PHP endpoints (`Login.php`).
- **Dynamic Color Management:** Authenticated users can store, search, and retrieve custom color entries.
- **Relational Data Mapping:** Each color record is linked directly to an authenticated user's `UserID`.
- **Lightweight Frontend:** Pure HTML5, CSS3, and vanilla JavaScript handling asynchronous API requests via Fetch/XHR.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu Linux | Cloud droplet host |
| **Web Server** | Apache HTTP Server | Web server & virtual host manager |
| **Database** | MySQL 8.0 | Relational storage for users and color entries |
| **Backend** | PHP 8.x | RESTful API endpoints handling JSON payloads |
| **Frontend** | HTML5 / CSS3 / JavaScript | Responsive UI with asynchronous client-side requests |
| **Infrastructure** | DigitalOcean | Cloud LAMP droplet hosting |

---

## Database Architecture

The application connects to a MySQL database named `COP4331` utilizing two core relational tables:

```text
Users (1) ───────────< Colors (N)
[ID, FirstName, LastName, Login, Password]       [ID, Color, UserID -> Users.ID]
```

### 1. `Users` Table
Stores registered user credentials and profile identifiers:
- `ID`: Unique user identifier (Primary Key, Auto Increment)
- `FirstName`: User's first name
- `LastName`: User's last name
- `Login`: Username credential (Unique)
- `Password`: Authentication secret

### 2. `Colors` Table
Stores custom color entries mapped to specific users:
- `ID`: Unique color record identifier (Primary Key, Auto Increment)
- `Color`: Color name or hex value
- `UserID`: Foreign reference matching `Users.ID`

---

## Project Structure

```text
├── LAMPAPI/                 # PHP backend endpoints (Login, Add, Search)
├── css/                     # Styling stylesheets
├── images/                  # Static assets and graphic resources
├── js/                      # Frontend JavaScript and DOM manipulation
├── color.html               # Main dashboard for color search/addition
├── index.html               # User login landing page
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## Environment Setup & Deployment Instructions

Follow these steps to deploy and configure this application on a clean Linux server.

### 1. Provision Infrastructure
Deploy a pre-configured LAMP stack on DigitalOcean using the [DigitalOcean LAMP 1-Click App](https://marketplace.digitalocean.com/apps/lamp).

### 2. Access Server via SSH
Connect to your remote droplet using a terminal or SSH client:
```bash
ssh root@YOUR_SERVER_IP
```

### 3. Configure MySQL Database
Log into the MySQL CLI:
```bash
mysql -u root -p
```

Create the application database and make sure to define user set as registration is not possible:
```sql
CREATE DATABASE COP4331;
USE COP4331;

CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Login VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Colors (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Color VARCHAR(50) NOT NULL,
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Seed an initial test user
INSERT INTO Users (FirstName, LastName, Login, Password) 
VALUES ('John', 'Doe', 'jdoe', 'securepass123');

-- Verify table creation and data
SELECT * FROM Users;
SELECT * FROM Colors;
```

### 4. Deploy Application Files
Upload repository files into the web server document root (`/var/www/html`) using SFTP, SCP, or VS Code Remote - SSH:
```bash
# Run from your local project root:
scp -r ./LAMPAPI ./css ./images ./js index.html color.html root@YOUR_SERVER_IP:/var/www/html/
```

Set appropriate web permissions for the Apache service user:
```bash
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### 5. Launch & Verify
Navigate to `http://YOUR_SERVER_IP/` in your browser to verify the login portal and test database operations.

---

## License

Distributed under the [MIT License](LICENSE).
