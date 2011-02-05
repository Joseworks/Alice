namespace :hirelings do
  desc "Start the hirelings"
  task :start, :roles => :app do
    run "cd #{current_path} && RAILS_ENV=#{rails_env} bundle exec hirelings_ctl start"
  end

  task :stop, :roles => :app do
    if remote_file_exists?(current_path)
      run "cd #{current_path} && if bundle show hireling; then RAILS_ENV=#{rails_env} bundle exec hirelings_ctl stop; fi"
    end
  end

  task :restart, :roles => :app do
    stop
    start
  end
end

def remote_file_exists?(full_path)
  'true' ==  capture("if [ -e #{full_path} ]; then echo 'true'; fi").strip
end

before 'deploy:update_code', 'hirelings:stop'
after 'deploy:start', 'hirelings:start'