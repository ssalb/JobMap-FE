import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";

const skills = [
  { text: "Mobilität & Führerschein", target: "mf" },
  { text: "Handwerk / Technik", target: "ht" },
  { text: "Industrie", target: "ind" },
  { text: "Gastronomie", target: "gas" },
  { text: "Forst- & Landwirtschaft", target: "fl" },
  { text: "Körperliche Tätigkeit", target: "kt" },
  { text: "Geistige Tätigkeit", target: "gt" },
  { text: "Administration / Verwaltung", target: "av" },
  { text: "Medizin / Gesundheit", target: "mg" },
  { text: "Soziales", target: "soz" },
  { text: "EDV", target: "edv" },
  { text: "Handel", taget: "han" },
  { text: "Dienstleistung", target: "din" },
  { text: "Kreativität / Kultur", target: "kk" },
  { text: "Drinnen", target: "dri" },
  { text: "Draußen", target: "dra" }
];

export default function Skills(props) {
  const { handleSkills } = props;
  const [state, setState] = React.useState({
    mf: false,
    ht: false,
    ind: false,
    gas: false,
    fl: false,
    kt: false,
    gt: false,
    av: false,
    mg: false,
    soz: false,
    edv: false,
    han: false,
    din: false,
    kk: false,
    dri: false,
    dra: false
  });

  const buildString = () => {
    var str = "";
    skills.map(skill => {
      state[skill.target] ? (str = str + skill.text + ", ") : (str = str + "");
    });
    handleSkills(str);
  };

  const handleChange = event => {
    setState(
      { ...state, [event.target.name]: event.target.checked },
      buildString()
    );
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Kompetentzen</FormLabel>
      <FormGroup row>
        {skills.map(skill => (
          <FormControlLabel
            control={
              <Checkbox
                checked={state[skill.target]}
                onChange={handleChange}
                name={skill.target}
              />
            }
            label={skill.text}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
