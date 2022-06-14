import { InputGroup, FormControl } from "react-bootstrap";

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <InputGroup size="sm" className="mb-3 mt-3 float-end w-25">
      <FormControl
        aria-label="Small"
        aria-describedby="inputGroup-sizing-sm"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search ... "
      />
    </InputGroup>
  );
};

export default GlobalFilter;
