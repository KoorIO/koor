#!/bin/bash
_interupt() { 
    echo "Shutdown $child_proc"
    kill -TERM "$child_proc" 2>/dev/null
    exit
}

trap _interupt INT TERM

workdir=${PWD} 

cd $workdir/websocket && nodemon index.js &
child_proc=$! 
cd $workdir/users && nodemon index.js &
child_proc=$! 
cd $workdir/apps && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/site && npm start &
child_proc="$child_proc $!"
cd $workdir/land && gulp dev &
child_proc="$child_proc $!"
cd $workdir/docs && PATH=./env/bin/ && mkdocs serve --dev-addr=0.0.0.0:8000
child_proc="$child_proc $!"
