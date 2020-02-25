#!/bin/bash
chromium-browser http://localhost:4321
php -S localhost:4321 -t ./public
