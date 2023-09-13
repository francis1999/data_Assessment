import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { Item } from "../types/Items";

interface Props {
  countryData: Item[];
}

const Index = ({ countryData }: Props) => {
  const [data, setData] = useState<Item[]>([]);
  const [filters, setFilters] = useState({
    continent: "",
    hasStates: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [sortDirection, setSortDirection] = useState("ASC");
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:4000/countries")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
  };

  const sortedData = data.slice(0);
  sortedData.sort((a, b) => {
    const nameA = a.nameUn.toLowerCase();
    const nameB = b.nameUn.toLowerCase();
    if (nameA < nameB) return sortDirection === "ASC" ? -1 : 1;
    if (nameA > nameB) return sortDirection === "ASC" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) => {
    const continentMatch =
      filters.continent.trim() === "" ||
      item.continent.toLowerCase().includes(filters.continent.toLowerCase());
  
    const hasStatesMatch =
      filters.hasStates.trim() === "" ||
      (item.hasStates ? "true" : "false") === filters.hasStates.toLowerCase();
  
    return continentMatch && hasStatesMatch;
  });
  

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <div style={{ marginBottom: "20px", padding: "10px" }}>
        <TextField
          label="Filter by Continent"
          name="continent"
          value={filters.continent}
          onChange={handleFilterChange}
          style={{ margin: 5 }}
        />
        <TextField
          label="Filter by hasStates"
          name="hasStates"
          value={filters.hasStates}
          onChange={handleFilterChange}
          style={{ margin: 5 }}
        />

        <span onClick={toggleSortDirection} style={{ cursor: "pointer" }}>
          Sort by NameUn ({sortDirection})
        </span>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Name (Unofficial)</TableCell>
              <TableCell>Continent</TableCell>
              <TableCell>hasStates</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.code}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.nameUn}</TableCell>
                <TableCell>{item?.continent}</TableCell>
                <TableCell>{item?.hasStates==true?"1":"0"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination" style={{ marginTop: 20 }}>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          style={{ marginRight: 10 }}
        >
          {"<"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount - 1}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default Index;
