import '../App.css';
import axios from 'axios'
import React from 'react';
import { useState } from 'react';
//require('dotenv').config()
//import Gpt3Output from './Gpt3Output';

function App() {
  
  const [userInput, setUserInput] = useState("...")
  const [finalInput, setFinalInput] = useState("...")
  const [gpt3Output, setGpt3Output] = useState("your output will be here")
  const [count, setCount] = useState(0)

  const instance = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: { Authorization: 'Bearer API_KEY'},
  });

  function onInputChange(e) {
    e.preventDefault()
    setUserInput(e.target.value)
    setFinalInput(e.target.value)
    console.log("user input: " + e.target.value)
    console.log("USER INPUT: " + userInput)
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log("SUBMITTED" + finalInput)
    // call gpt3Output function
    getGpt3Output(finalInput)
  }


  /// LOOK HERE REDDITOR ///
  function getGpt3Output(userInput) {
    // text which will be the prompt
    const dialog = []
    if (count === 0) {
      dialog.push('This is an English to Powershell translator:\n')
      //dialog.push("\n###\n")
      dialog.push('English: Copy each folder in documents folder_1 to documents\nPowershell: Get-ChildItem -Directory -Path "C:\\Users\\$env:username\\Documents\\folder_1" | ForEach-Object { Copy-Item -Path $($_.FullName) -Destination "C:\\Users\\$env:username\\Documents" -Force }\n###\nEnglish: Move the file named documents folder_1 file_1 to documents\nPowershell: Move-Item -Path "C:\\Users\\$env:UserName\\Documents\\folder_1\\file_1" -Destination "C:\\Users\\$env:UserName\\Documents\\folder_1" -Force')
      dialog.push("\n###\n")
      dialog.push('English: Create 3 files named test_.txt in documents where _ is the number 1 to 3 and add the text "GPT3" to each file\nPowershell: ForEach ($i in 1..3) { New-Item -Path "C:\\Users\\$env:UserName\\Documents\\test_$i.txt" -ItemType File -Force; Add-Content -Path "C:\\Users\\$env:UserName\\Documents\\test_$i.txt" -Value "GPT3" }')
      dialog.push("\n###\n")
      dialog.push('English: Create a file named gpt3_stuff.txt in documents folder_3 and rename it to gpt3_renamed.txt and move it to documents\nPowershell: New-Item -Path "C:\\Users\\$env:UserName\\Documents\\folder_3\\gpt3_stuff.txt -Force; Rename-Item -Path "C:\\Users\\$env:UserName\\Documents\\folder_3\\gpt3_stuff.txt" -NewName "gpt3_renamed.txt"" -ItemType File -Force; Move-Item -Path "C:\\Users\\$env:UserName\\Documents\\folder_3\\gpt3_renamed.txt" -Destination "C:\\Users\\$env:UserName\\Documents" -Force;')
      dialog.push("\n###\n")
      dialog.push('English: Get all processes and export them to a csv\nPowershell: Get-Process | Export-Csv -Path "C:\\Users\\$env:UserName\\Documents\\Processes.csv" -NoTypeInformation -Force')
      dialog.push("\n###\n")
      dialog.push('English: Create a firewall exception for "C:\\ProgramFiles\\Java\\java.exe"\nPowershell: New-NetFirewallRule -DisplayName "Java" -Direction Inbound -Program "C:\\ProgramFiles\\Java\\java.exe" -Enabled True')
      dialog.push("\n###\n")
      dialog.push('English: Copy desktop file.txt to documents\nPowershell: Copy-Item -Path "C:\\Users\\$env:UserName\\Desktop\\file.txt" -Destination "C:\\Users\\$env:UserName\\Documents" -Force')  
    }
    else {
      dialog.push('This is an English to Powershell translator:\n###\n')
      dialog.push('English: Get the html content of www.reddit.com\nPowershell: Invoke-WebRequest -Uri "http://www.reddit.com" -UseBasicParsing | Select-Object -ExpandProperty Content')
      dialog.push("\n###\n")
      dialog.push('English: Get all processes and export them to a csv\nPowershell: Get-Process | Export-Csv -Path "C:\\Users\\$env:UserName\\Documents\\Processes.csv" -NoTypeInformation')
      dialog.push("\n###\n")
      dialog.push('English: Create a detection cluase that detects the application app.exe in a specific folder where the version is greater than or equal to 1.0.0. \nPowershell: New-CMDetectionClauseFile -Path "C:\\Program Files\\Application" -FileName App.exe -Value -PropertyType Version -ExpressionOperator GreaterEquals -ExpectedValue "1.0.0"')
    }
    dialog.push("\n###\n")
    dialog.push(`English: ${userInput}\nPowershell: `);
    
    // add one to the counter to get a smaller input. GPT-3 remembers the previous larger input, so we can replace it with a smaller input
    // while still getting the same quality
    setCount(count + 1)
    
    console.log(dialog.join(""))

    // create the completion parameters object, using DIALOG as the prompt
    const completionParmas = {
        prompt: dialog.join(''),
        //prompt: dialog,
        max_tokens: 150,
        temperature: 0.15,
        n: 1,
        stream: false,
        logprobs: null,
        echo: false,
        stop: '\n',
    };

    
    //console.log("INSTANCE: \n" + instance())
    // send a POST method to the API endpoint, which includes the created completion parameters
    const result = instance.post('/engines/davinci/completions', completionParmas)
    .then((response) => {
        console.log(response.data.choices[0].text);
        console.log(response.status)
        setGpt3Output(response.data.choices[0].text)
        dialog.push(gpt3Output + "\n###\n")
        //console.log(dialog.join(''))
    })

  }

  
 


  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <p>Enter an English command in the text box to translate it to PowerShell</p>
        <p>For example: copy the file file.txt from desktop to documents</p>
        <input type="textbox" onChange={e => onInputChange(e)}></input>
        <button type="submit">Submit</button>
      </form>
      <p id="gpt3-output">{gpt3Output}</p>
    </div>
  );
}

export default App;
