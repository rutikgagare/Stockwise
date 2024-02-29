#!/bin/bash

# Open first terminal and run frontend commands
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend; npm i; npm start"

# Open second terminal and run backend commands
gnome-terminal --tab --title="Backend" -- bash -c "cd backend; npm i; npm start"

