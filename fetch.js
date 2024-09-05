let beamData = [];

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    beamData = data; //storing the data as a global variable for script.js to access
    console.log(data); 

    // Find the container in the html
    const container = document.getElementById('data-container');
    const sectionSelect = document.getElementById('sectionSelect')

    //Create a string of HTML to insert
    let htmlContent = '<table> <tr> <th>Section</th> <th>Depth <br> h (mm) </th> <th>Width<br>b (mm) </th> <th>Mass<br> m (kg/m) </th> <th>Elastic modulus y-y<br> W<sub>ely</sub> (cm<sup>3</sup>) <th>Elastic modulus z-z<br> W<sub>elz</sub> (cm<sup>3</sup>) <th>Plastic modulus y-y<br> W<sub>ply</sub> (cm<sup>3</sup>) <th>Plastic modulus z-z<br> W<sub>plz</sub> (cm<sup>3</sup>) ';
    data.forEach(item => {
      // create data table for steel sections
        htmlContent += `<tr>
                            //<td>${item.section}</td>
                            //<td>${item.depth}</td>
                            <td>${item.width}</td>
                            <td>${item.mass}</td>
                            <td>${item.elasticmodulusy}</td>
                            <td>${item.elasticmodulusz}</td>
                            <td>${item.plasticmodulusy}</td>
                            <td>${item.plasticmodulusz}</td>
                        </tr>`
        const option = document.createElement('option');
        option.value = item.section;
        option.textContent = item.section;
        sectionSelect.appendChild(option);
        
    });
    htmlContent += '</table> <br>';

    // Insert the HTML into the container
    container.innerHTML = htmlContent;
  })

  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
   });
