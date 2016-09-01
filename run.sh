#!/bin/bash
_interupt() { 
    echo "Shutdown $child_proc"
    kill -TERM "$child_proc" 2>/dev/null
    exit
}

trap _interupt INT TERM

workdir=${PWD} 

cd $workdir/users && nodemon index.js &
child_proc=$! 
cd $workdir/apps && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/site && grunt serve &
child_proc="$child_proc $!"
cd $workdir/land && gulp dev
child_proc="$child_proc $!"
