# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  unless Vagrant.has_plugin?('vagrant-gatling-rsync')
    puts "required: '$ vagrant plugin install vagrant-gatling-rsync'"
    exit!
  end
  unless Vagrant.has_plugin?('vagrant-rsync-back')
    puts "required: '$ vagrant plugin install vagrant-rsync-back'"
    exit!
  end

  config.vm.box = "ubuntu/trusty64"
  config.vm.provision "file", source: "~/.ssh/id_rsa", destination: "~/.ssh/id_rsa"
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/id_rsa.pub"
  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y git unzip wget curl
  SHELL
  config.vm.provision :shell, path: "./ops/init.sh"

  config.vm.provision "ruby", type: "shell", inline: <<-SHELL
    echo "Installs RVM (Ruby Version Manager) for handling Ruby installation"
    sudo su vagrant && gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 && \
        curl -sSL https://get.rvm.io | bash -s stable && \
        source /etc/profile.d/rvm.sh && \
        rvm install ruby-2.3.3 && \
        rvm --default use ruby-2.3.3 && \
        gem install bundle && \
        gem install rails
  SHELL

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/home/vagrant/projects/koor", type: "rsync",
    rsync__exclude: [".git/", ".idea/", ".vagrant", "node_modules/", "bower_components/"]

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
    # port chats service
    n1.vm.network "forwarded_port", guest: 3006, host: 3006
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
    # port cms
    n1.vm.network "forwarded_port", guest: 3007, host: 3007
  end
end
