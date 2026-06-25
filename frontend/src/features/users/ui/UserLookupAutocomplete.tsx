import { Icon } from "@iconify/react";
import { Autocomplete, Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useUserSearchQuery } from "@/features/users/api/usersQueries";
import type { UserLookupItem } from "@/features/users/model/user.types";

type UserLookupAutocompleteProps = {
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label: string;
  onChange: (value: UserLookupItem | null) => void;
  placeholder?: string;
  value: UserLookupItem | null;
};

function getAvatarFallback(option: UserLookupItem): string {
  const source = option.username.trim() || option.displayName.trim();

  return source.charAt(0).toUpperCase() || "U";
}

export function UserLookupAutocomplete({
  disabled = false,
  error = false,
  helperText,
  label,
  onChange,
  placeholder,
  value,
}: UserLookupAutocompleteProps) {
  const [searchValue, setSearchValue] = useState("");
  const searchQuery = useUserSearchQuery(searchValue);
  const options = searchQuery.data ?? [];

  return (
    <Autocomplete
      disabled={disabled}
      filterOptions={(items) => items}
      getOptionLabel={(option) =>
        option.displayName && option.displayName !== option.username
          ? `${option.username} (${option.displayName})`
          : option.username
      }
      isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
      loading={searchQuery.isLoading}
      noOptionsText={searchValue.trim().length < 2 ? "Type at least 2 characters" : "No users found"}
      onChange={(_event, nextValue) => onChange(nextValue)}
      onInputChange={(_event, nextValue, reason) => {
        if (reason === "input") {
          setSearchValue(nextValue);
        }
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          label={label}
          placeholder={placeholder}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="row" spacing={1.1} sx={{ alignItems: "center", minWidth: 0 }}>
            <Avatar src={option.avatarUrl ?? undefined} sx={{ height: 30, width: 30 }}>
              {option.avatarUrl ? null : getAvatarFallback(option)}
            </Avatar>
            <Stack spacing={0.15} sx={{ minWidth: 0 }}>
              <Typography variant="body2">{option.username}</Typography>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", minWidth: 0 }}>
                <Icon icon="solar:user-linear" style={{ fontSize: 13, opacity: 0.7 }} />
                <Typography color="text.secondary" noWrap variant="caption">
                  {option.displayName}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
      value={value}
    />
  );
}
