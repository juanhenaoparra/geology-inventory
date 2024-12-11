# Variables
DASHBOARD_FOLDER := frontend
BACKEND_FOLDER := api
VENV_NAME := venv
PYTHON := python3
PIP := $(VENV_NAME)/bin/pip
NPM := npm

# Default target
all: venv install

# Create virtual environment
venv:
	cd $(BACKEND_FOLDER) && $(PYTHON) -m venv $(VENV_NAME)

# Install dependencies
install: venv
	cd $(BACKEND_FOLDER) && $(PIP) install -r requirements.txt
	cp $(BACKEND_FOLDER)/.env.example $(BACKEND_FOLDER)/.env
	$(MAKE) npm-install

npm-install:
	cd $(DASHBOARD_FOLDER) && $(NPM) install

run-frontend:
	cd $(DASHBOARD_FOLDER) && $(NPM) run start

run-backend:
	cd $(BACKEND_FOLDER) && $(VENV_NAME)/bin/python main.py

test:
	cd $(BACKEND_FOLDER) && $(VENV_NAME)/bin/pytest tests/

# Clean up
clean:
	rm -rf $(BACKEND_FOLDER)/$(VENV_NAME)
	rm -rf $(DASHBOARD_FOLDER)/node_modules
