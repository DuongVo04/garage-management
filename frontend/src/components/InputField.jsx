import { TextField } from "@mui/material";

const InputField = ({
	label,
	type = "text",
	name,
	value,
	onChange
}) => {
	return (
		<TextField
			fullWidth
			label={label}
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			variant="outlined"
			margin="normal"
		/>
	);
};

export default InputField;