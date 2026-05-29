"use client"

import { Search } from "@mui/icons-material"
import RefreshIcon from "@mui/icons-material/Refresh"
import { Button, InputAdornment, Stack, TextField, debounce } from "@mui/material"
import { useCallback, useEffect, useState } from "react"

interface TableToolbarProps<T extends { search?: string }> {
  filter: T
  setFilter: React.Dispatch<React.SetStateAction<T>>
  searchBar?: {
    placeholder?: string
    width?: string | number
    size?: "small" | "medium"
    show?: boolean
  }
  primaryButton?: {
    children?: React.ReactNode
    size?: "small" | "medium" | "large"
    onClick?: () => void
    show?: boolean
    startIcon?: React.ReactNode
  }
  refreshButton?: {
    show?: boolean
    iconOnly?: boolean
    onClick?: () => void
    variant?: "outlined" | "contained" | "text"
  }
}

const TableToolbar = <T extends { search?: string }>({
  filter,
  setFilter,
  searchBar,
  primaryButton,
  refreshButton
}: TableToolbarProps<T>) => {
  const [searchValue, setSearchValue] = useState(filter.search || "")

  const showSearchBar = searchBar !== undefined && searchBar.show !== false
  const showPrimaryButton = primaryButton !== undefined && primaryButton.show !== false
  const showRefreshButton = refreshButton !== undefined && refreshButton.show !== false

  const debouncedHandleSearch = useCallback(
    debounce((val: string) => {
      setFilter((prev) => ({
        ...prev,
        search: val
      }))
    }, 500),
    [setFilter]
  )

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchValue(e.target.value)
    debouncedHandleSearch(e.target.value)
  }

  useEffect(() => {
    setSearchValue(filter.search || "")
  }, [filter.search])

  return (
    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
      <Stack direction={"row"} spacing={1}>
        {showSearchBar && (
          <TextField
            id="outlined-basic"
            placeholder={searchBar?.placeholder || "Search"}
            variant="outlined"
            size={searchBar?.size || "small"}
            value={searchValue}
            onChange={handleSearchChange}
            sx={searchBar?.width ? { width: searchBar.width } : undefined}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      </Stack>
      <Stack direction={"row"} spacing={1}>
        {showRefreshButton && (
          <Button
            variant={refreshButton?.variant || "outlined"}
            onClick={refreshButton?.onClick}
          >
            <RefreshIcon />
          </Button>
        )}
        {showPrimaryButton && (
          <Button
            variant="contained"
            color="primary"
            size={primaryButton?.size}
            startIcon={primaryButton?.startIcon}
            onClick={primaryButton?.onClick}
          >
            {primaryButton?.children}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default TableToolbar
