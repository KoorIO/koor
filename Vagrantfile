Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y whois git unzip wget curl
    sudo useradd -m -p `mkpasswd password` -s /bin/bash dev
    sudo usermod -a -G sudo dev
  SHELL
  config.vm.provision :shell, path: "./ops/init.sh"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = 4096
    vb.cpus = 2
  end

  config.vm.define "nodeone" do |n1|
    n1.vm.hostname = "nodeone"
    # port user service
    n1.vm.network "forwarded_port", guest: 3000, host: 3000
    # port apps service
    n1.vm.network "forwarded_port", guest: 3001, host: 3001
    # port socials service
    n1.vm.network "forwarded_port", guest: 3004, host: 3004
    # port swagger service
    n1.vm.network "forwarded_port", guest: 3005, host: 3005
    # port websocket service
    n1.vm.network "forwarded_port", guest: 5000, host: 5000
    # port land page
    n1.vm.network "forwarded_port", guest: 3002, host: 3002
    n1.vm.network "forwarded_port", guest: 3003, host: 3003
    # port site
    n1.vm.network "forwarded_port", guest: 9000, host: 9000
    # port site liveboard
    n1.vm.network "forwarded_port", guest: 35729, host: 35729
    # port mqtt 
    n1.vm.network "forwarded_port", guest: 1883, host: 1883
    # port mqtt over websocket
    n1.vm.network "forwarded_port", guest: 8080, host: 8080
  end
end
