document.addEventListener('DOMContentLoaded', () => {
    const sectionSelect = document.getElementById('sectionSelect');
    const gradeSelect = document.getElementById('gradeSelect');
    const calculateButton = document.getElementById('calculateButton');
    const results = document.getElementById('results');

    let selectedBeam = null;
    let section = null;
    let depth = null;
    let width = null;
    let mass = null;
    let area = null;
    let webthickness = null;
    let flangethickness = null;
    let rootradius = null;
    let elasticmodulusy = null;
    let elasticmodulusz = null;
    let plasticmodulusy = null;
    let plasticmodulusz = null;

    let steelgrade = null;
    let ym0 = 1;
    
    let momenty = 0;

    sectionSelect.addEventListener('change', (event) => {
        const selectedSection = event.target.value;

        selectedBeam = beamData.find(beam => beam.section === selectedSection);

        if (selectedBeam) {
            section = selectedSection;
            depth = selectedBeam.depth;
            width = selectedBeam.width;
            mass = selectedBeam.mass;
            area = selectedBeam.area;
            webthickness = selectedBeam.web_thickness;
            flangethickness = selectedBeam.flange_thickness;
            rootradius = selectedBeam.root_radius;
            elasticmodulusy = selectedBeam.elasticmodulusy;
            elasticmodulusz = selectedBeam.elasticmodulusz;
            plasticmodulusy = selectedBeam.plasticmodulusy;
            plasticmodulusz = selectedBeam.plasticmodulusz;


            console.log(`Section selected: ${section}`);
            console.log(`Depth: ${depth} mm`);
            console.log(`Width: ${width} mm`);
            console.log(`Mass: ${mass} kg/m`);
            console.log(`Area: ${area} cm^2`);
            console.log(`Web thickness: ${webthickness} mm`);
            console.log(`Flange thickness: ${flangethickness} mm`);
            console.log(`Root radius: ${rootradius} mm`);
            console.log(`Elastic modulus y: ${elasticmodulusy} cm^3`);
            console.log(`Elastic modulus z: ${elasticmodulusz} cm^3`);
            console.log(`Plastic modulus y: ${plasticmodulusy} cm^3`);
            console.log(`Plastic modulus z: ${plasticmodulusz} cm^3`);

        } else {
            console.error('Selected section not found in data');
        }
    });

    gradeSelect.addEventListener('change', (event) => {
        steelgrade = event.target.value;
        console.log(steelgrade);

    } )

    calculateButton.addEventListener('click', () => { // Listener for user to click calculate button
        console.log('calculate!');

        // Shear check
        let sheary = document.getElementById('sheary').value; // Get the shear-y value input
        let shearz = document.getElementById('shearz').value; // Get the shear-z value input
        sheary = parseFloat(sheary); // Parse to ensure it is a float
        shearz = parseFloat(shearz); // Parse to ensure it is a float

        momenty = document.getElementById('momenty').value; // Get the moment-y value input
        momentz = document.getElementById('momentz').value; // Get the moment-z value input
        momenty = parseFloat(momenty); // Parse to ensure it is a float
        momentz = parseFloat(momentz); // Parse to ensure it is a float

        if (isNaN(sheary) || isNaN(shearz) || isNaN(momenty) || isNaN(momentz)) {
            results.innerHTML = "<b>Please enter values for shear and moment forces, if no force please enter 0.</b>"
        } else {

            // Calculate shear resistance for selected section
            let hw = depth - 2 * flangethickness;
            let areamm = area * 100;
            let Av = (Math.max(areamm - (2 * width * flangethickness) + (webthickness + 2 * rootradius) * flangethickness, 1 * hw * webthickness)).toFixed(2);
            let shear_resistance = (((Av * steelgrade)/(3**0.5))/1000).toFixed(2);

            // Calculate shear utilisation for both y and z axes
            let sheary_ut = (sheary/shear_resistance).toFixed(2);
            let shearz_ut = (sheary/shear_resistance).toFixed(2);
            let sheary_result = "";
            let shearz_result = "";

            // Shear y-y utilisation
            if (sheary_ut < 1) {
                sheary_result = "PASS";
            } else {
                sheary_result = "FAIL";
            }
        

            // Shear z-z utilisation
            if (shearz_ut < 1) {
                shearz_result = "PASS";
            } else {
                shearz_result = "FAIL";
            }

            // Moment resistance calculation
            moment_resistance_y = plasticmodulusy * 1000 * steelgrade /10**6;
            moment_resistance_z = plasticmodulusz * 1000 * steelgrade /10**6;

            let momenty_ut = (momenty/moment_resistance_y).toFixed(2);
            let momentz_ut = (momentz/moment_resistance_z).toFixed(2);
            let momenty_result = "";
            let momentz_result = "";

            // Moment y-y utilisation
            if (momenty_ut < 1) {
                momenty_result = "PASS";
            } else {
                momenty_result = "FAIL";
            }

            // Moment y-y utilisation
            if (momentz_ut < 1) {
                momentz_result = "PASS";
            } else {
                momentz_result = "FAIL";
            }
            

            if (selectedBeam) {
                results.innerHTML = `<h3>Results</h3> 
                                    <h4>Section details</h4>
                                    Section selected = ${section} <br> 
                                    Steel grade = S${steelgrade}<br><br>

                                    <h4>Shear check</h4>
                                    Shear major axis, V<sub>Edy</sub> = ${sheary} kN<br> 
                                    Shear minor axis, V<sub>Edz</sub> = ${shearz} kN<br> <br>


                                    Shear area, A<sub>v</sub> = A - 2 x b x t<sub>f</sub> + (t<sub>w</sub> + 2 x r) x t<sub>f</sub> x n x h<sub>w</sub> x t<sub>w</sub> <br>
                                    A<sub>v</sub> = ${areamm} - 2 x ${width} x ${flangethickness} + (${webthickness} + 2 x ${rootradius}) x ${flangethickness} x 1.0 x ${hw} x ${webthickness}
                                    = ${Av} mm<sup>2</sup> <br>
                                    Shear resistance, V<sub>Rd</sub> = A<sub>v</sub> x f<sub>y</sub>/(3<sup>0.5</sup>) = ${Av} x (${steelgrade}/(3<sup>0.5</sup>))/y<sub>M0</sub> = ${shear_resistance} kN <br> <br>
                                    
                                    Shear major axis utilisation = V<sub>Edy</sub>/V<sub>Rd</sub> = ${sheary}/${shear_resistance} = ${sheary_ut} &nbsp; &nbsp; &nbsp; <b>${sheary_result}</b><br>
                                    Shear minor axis utilisation = V<sub>Edz</sub>/V<sub>Rd</sub> = ${shearz}/${shear_resistance} = ${shearz_ut} &nbsp; &nbsp; &nbsp; <b>${shearz_result}</b><br>
                                    

                                    <h4>Moment check</h4>
                                    Moment major axis, M<sub>Edy</sub> = ${momenty} kNm <br>
                                    Moment minor axis, M<sub>Edz</sub> = ${momentz} kNm <br><br>

                                    Moment resistance y, M<sub>Rdy</sub> = W<sub>ply</sub> x f<sub>y</sub> / y<sub>M0</sub> = ${plasticmodulusy*1000} x ${steelgrade} / ${ym0} = ${moment_resistance_y} kNm <br>
                                    Moment resistance z, M<sub>Rdz</sub> = W<sub>plz</sub> x f<sub>y</sub> / y<sub>M0</sub> = ${plasticmodulusz*1000} x ${steelgrade} / ${ym0} = ${moment_resistance_z} kNm <br>
                                    <br>
                                    Moment major axis utilisation = M<sub>Edy</sub>/M<sub>Rdy</sub> = ${momenty}/${moment_resistance_y} = ${momenty_ut} &nbsp; &nbsp; &nbsp; <b>${momenty_result}</b><br>
                                    Moment minor axis utilisation = M<sub>Edz</sub>/M<sub>Rdz</sub> = ${momentz}/${moment_resistance_z} = ${momentz_ut} &nbsp; &nbsp; &nbsp; <b>${momentz_result}</b><br>
                                    `;

            } else {
                console.error('No section selected');
            }
        }
    });
    

});