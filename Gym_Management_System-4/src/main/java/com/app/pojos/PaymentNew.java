package com.app.pojos;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@Getter
@Setter
public class PaymentNew {
    private BigDecimal amount;
    private String userId;
    private int planId;
    private String nonce;
    
}
