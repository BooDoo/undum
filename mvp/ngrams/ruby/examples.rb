$: << "."
require 'trigram_analyzer'
require 'trigram_generator'
require 'json'

unless File.exists?("trigrams.json")
	text = ""
	Dir.glob("../../../txt/*.{txt,TXT}") do |source|
	 	text << "\n\n" << File.open(source, "rt:UTF-8").read
	end

	patterns = TrigramAnalyzer.analyze_text(text)

	pfile = File.new("trigrams.json", "w")
	pfile << JSON.pretty_generate(patterns)
end

stash = if File.exists?("uniques.json")
					File.open("uniques.json", "rt:UTF-8")
				elsif File.exists?("trigrams.json")
					File.open("trigrams.json", "rt:UTF-8")
				end

patterns ||= JSON.load(stash.read)

output = File.open("output.txt", "a:UTF-8")
output << TrigramGenerator.generate_text(patterns, 5, 2) << "\n\n"