#!/bin/bash

workdir=${PWD} 

cd $workdir/users && nodemon index.js &
cd $workdir/apps && nodemon index.js &
cd $workdir/site && grunt serve &
cd $workdir/land && gulp dev
