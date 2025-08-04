from datetime import date
import json
import pyperclip

url = input("URL: ")
url = url.replace("goofybox.glitch.me", "goofybox-studios.github.io")
pyperclip.copy(url)
print("Copied better url!")
url = input("URL: ")
title = input("TITLE: ")
today = date.today().strftime("%Y-%m-%d")
authors = input("AUTHORS: ")

entry = {
	title: {
		"title": title,
		"versions": [
			{
				"date": today,
				"authors": [ ("Haizlbliek" if a.lower() == "h" else ("Zephyrus" if a.lower() == "z" else "")) for a in authors.split() ],
				"url": url
			}
		]
	}
}

formatted_json = json.dumps(entry, indent="\t")

pyperclip.copy("," + formatted_json[1:-2])
print("Copied entry to clipboard.")
