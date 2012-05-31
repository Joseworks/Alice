Hireling.schedule ||= Hireling::Schedule.new.tap do |s|
  s[:carlos].every("1m")
  s[:felix].every("30m")
end
