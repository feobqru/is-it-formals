require 'dotenv/load'
require 'rake'
require 'httparty'
require 'csv'
require 'json'
require 'tilt'
require 'tilt/erb'
require 'i18n'

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

desc "Generate the HTML files from the ERB templates"
task :generate_html do
  I18n.load_path += Dir[File.expand_path("locales") + "/*.yml"]
  I18n.default_locale = :en 
  I18n.available_locales = [:en, :mi, :zh]
  # Generate the index.html file
  ['en', 'mi', 'zh'].each do |locale|
    I18n.locale = locale
    ['index', 'formals_checklist', 'how_to_tie_a_tie'].each do |template_name|
    template = Tilt::ERBTemplate.new("templates/#{template_name}.html.erb")
      File.open("docs/#{template_name}-#{locale}.html", 'w') do |f|
        f.write(template.render(self))
      end
    end
  end
  FileUtils.cp('docs/index-en.html', 'docs/index.html')
  FileUtils.cp('docs/formals_checklist-en.html', 'docs/formals_checklist.html')
  FileUtils.cp('docs/how_to_tie_a_tie-en.html', 'docs/how_to_tie_a_tie.html')
end