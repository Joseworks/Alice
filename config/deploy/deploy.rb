#
# RVM support
#
$:.unshift(File.expand_path('./lib', ENV['rvm_path'])) # Add RVM's lib directory to the load path.
require "rvm/capistrano"                  # Load RVM's capistrano plugin.
set :rvm_ruby_string, '1.9.2'

#
# Bundler support
#
require "bundler/capistrano"

#
# Application environment defaults
# These should be set by the (environment) task, run first
#
set :rails_env, 'development'
set :instance, "localhost" 
set :branch, "master" 

#
# environment settings (by task)
#
desc "Runs any following tasks to production environment"
task :production do
  set :rails_env, "production"
  set :instance, "qre.flipstone.com"
  set_servers
end

desc "Sets server IP/DNS values"
task :set_servers do
  role :web,      "#{instance}"
  role :app,      "#{instance}"
  role :db,       "#{instance}", :primary => true 
end

#
# Application settings (across all envs)
#
set :application, "quidnunc"
set :deploy_to,   "/srv/quidnunc"
set :scm,         "git"
set :local_scm_command, "git"
set :scm_command, "GIT_SSH=#{deploy_to}/git_ssh.sh git"
set :scm_passphrase, ""
set :deploy_via,  :remote_cache
set :repository,  "git@github.com:flipstone/quidnunc.git"
set :use_sudo,    false
set :user,        "ubuntu"

ssh_options[:keys]      = ["#{ENV['HOME']}/.ssh/fs-remote.pem"]
ssh_options[:paranoid]  = false
ssh_options[:user]      = "ubuntu"

default_run_options[:pty] = true

set :unicorn, {
  port: 6502,
  worker_processes: 1,
  worker_timeout: 15, #in seconds
  preload_app: false
}

set :nginx_cfg, {
  port: 80
}

set :rds, {
  :host => "flipstone.ctf5dd2ocka6.us-east-1.rds.amazonaws.com",
  :master_user => "flipstone",
  :master_pwd => "flipstone",
  :port => "3306"
}

set :bundle_cmd,  "cd #{release_path} && bundle"

#
# Deploy callbacks
#
before 'deploy:start', "deploy:unicorn_config"
