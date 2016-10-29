package com.smartsafe.dto;

public class GreetingDto {

    private final long id;
    private final String content;

    public GreetingDto(long id, String content) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}