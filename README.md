# BashGen
A simple node script that generates bash profile files based on a config file. It also stores and copies my .vimrc and .tmux.conf files.

# Usage
On first run
```
bash init.sh <your-email>
```
For all consequtive runs use `bashgen` if you just want to update your setup or `bashgen -w` if you want to first edit config.json.

# Install
By running the init.sh script, bashgen install and configures a list of tools needed for a development environment. It also generates ssh keys for you. Here is the list of tools:

* npm
* nodejs
* tmux
* git
* cmake
* build-essential
* pyton 2.7
* python 3
* powerline
* vim
* gvim
* vundle
* apt-vim
* ctags
