require 'dotenv/load'
require 'rake'
require 'httparty'
require 'csv'
require 'json'

desc "Pulls OLE Calendar CSV files from the OLE server and exetracts the formal days"
task :pull_csv do
  # set the URL to pull the CSV file from the OLE server
  url = "https://ole.saintkentigern.com/calendar/export.php?export=all&event_type=&token=#{ENV['OLE_TOKEN']}&format=csv"
  
  # pulling the CSV file from the OLE server and parsing it
  response = HTTParty.get(url)
  csv = CSV.new(response.body, headers: true) 
  
  # initialize a hash to store formal days
  formal_days = Hash.new
  
  # loop through each calender entry
  csv.each do |line|
    # if line contains the word formal, save it to hash
    if line['name'] && line['name'].downcase.include?('formal')
      # extract the date and name
      date = line['start_date']
      name = line['name']
      
      # edgecase maybe if line contains for years 
      is_formal = 'yes'
      is_formal = 'maybe' if line['name'].downcase.include?('required for year')
      
      # save to the hash with date as key and name as value
      formal_days[date] = {name: name, is_formal: is_formal}
    end
  end

  # Write the formal days to a JSON file
  File.open('docs/js/formal_days.json', 'w') do |f|
    f.write(JSON.pretty_generate(formal_days))
  end
end