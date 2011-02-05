desc "Cruise test and deploy"
task :cruise do
  sh "cap production deploy:migrations"
end
