package com.smartsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GreetingDto {

    private final long id;
    private final String content;
}