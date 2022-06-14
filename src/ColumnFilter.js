import { InputGroup, FormControl } from "react-bootstrap";

const ColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <InputGroup size="sm" className="mb-3 mt-3">
      <FormControl
        aria-label="Small"
        aria-describedby="inputGroup-sizing-sm"
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={"Search ..."}
      />
    </InputGroup>
  );
};

export default ColumnFilter;
