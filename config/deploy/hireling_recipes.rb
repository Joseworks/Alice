namespace :hirelings do
  desc "Start the hirelings"
  task :start, :roles => :app do
    run "cd #{current_path} && RAILS_ENV=#{rails_env} bundle exec hirelings_ctl start"
  end

  task :stop, :roles => :app do
    run "cd #{current_path} && if bundle show hireling; then RAILS_ENV=#{rails_env} bundle exec hirelings_ctl stop; fi"
  end

  task :restart, :roles => :app do
    stop
    start
  end
end

after 'deploy:start', 'hirelings:start'
before 'deploy:update_code', 'hirelings:stop'
