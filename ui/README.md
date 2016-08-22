# Ashes Content Archive

# Setting up using JS Tools (npm, bower)

* Install npm
* Install bower
* Install gulp (`npm install --save-dev gulp`)
* run `npm install`
* run `bower install`
* run `gulp serve`

# Overview

The intention of this web application is to serve as a means to navigate used media.

The goal is to function in two modes: Standalone and Launched.

* Standalone: This mode must be able to function without the need of a backed Baobab Instance (BI) 
* Launched: Launched mode is backed by a BI that initiated it, sending configuration data once
 the app is ready to proceed with actions.

## Launched Initiation Protocol

When not running in standalone mode, 

### Definitions

* A - Origin
* B - This App

### Launching and Configuration Process

1. A initiates B (`Loading`)
1. B loads and when complete, notifies A (`Ready`)
1. A sends configuration to B (`Configures`)
1. B continues based on the configuration received.

# Docker Build

## Requirements

* xmllint - used for parsing information from the POM file