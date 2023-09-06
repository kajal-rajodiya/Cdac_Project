package com.app.services;

import java.util.List;

import com.app.dto.PlanDto;
import com.app.pojos.PaymentNew;
import com.app.pojos.Plan;
import com.braintreegateway.Result;
import com.braintreegateway.Transaction;

public interface IPlanService {

	public void createPlan(PlanDto planDto);

	public Plan getPlan(int planId);

	public void deletePlan(PlanDto planDto);

	public void updatePlan(PlanDto planDto);

	public List<Plan> getAllPlans();

	public Transaction makePayment(PaymentNew paymentNew);

	public Plan findPlan(int planId);

}
