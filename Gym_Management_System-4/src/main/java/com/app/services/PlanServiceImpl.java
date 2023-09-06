package com.app.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.PlanRepository;
import com.app.dto.PlanDto;
import com.app.pojos.PaymentNew;
import com.app.pojos.Plan;
import com.braintreegateway.BraintreeGateway;
import com.braintreegateway.Customer;
import com.braintreegateway.CustomerRequest;
import com.braintreegateway.Environment;
import com.braintreegateway.Result;
import com.braintreegateway.Transaction;
import com.braintreegateway.TransactionRequest;

@Service
@Transactional
public class PlanServiceImpl implements IPlanService {
	@Autowired
	private PlanRepository planDao;

	@Override
	public void createPlan(PlanDto planDto) {
		Plan plan = new Plan();
		BeanUtils.copyProperties(planDto, plan);
		planDao.save(plan);
	}

	@Override
	public Plan getPlan(int planId) {
		Plan plan = planDao.getById(planId);
		return plan;
	}

	@Override
	public void deletePlan(PlanDto planDto) {
		planDao.deleteById(planDto.getId());
	}

	@Override
	public void updatePlan(PlanDto planDto) {
		Plan plan = this.getPlan(planDto.getId());
		BeanUtils.copyProperties(planDto, plan);
		planDao.save(plan);
	}

	@Override
	public List<Plan> getAllPlans() {
		List<Plan> list = planDao.findAll();
		return list;
	}

	@Override
	public Transaction makePayment(PaymentNew paymentNew) {
		String MERCHANT_ID = "9c6q8k6bss7gt5gj";
		String PUBLIC_KEY = "9h2zrr3sbc9fq59c";
		String PRIVATE_KEY = "7a641cff910194241bdb21e33174ac71";

		BraintreeGateway gateway = new BraintreeGateway(Environment.SANDBOX, MERCHANT_ID, PUBLIC_KEY, PRIVATE_KEY);
		CustomerRequest custRequest = new CustomerRequest().firstName("Cust -" + paymentNew.getUserId());
		Result<Customer> result = gateway.customer().create(custRequest);

		if (result.isSuccess()) {
			String customerId = result.getTarget().getId();
			System.out.println(customerId);
			// PaymentMethodRequest methodRequest = new PaymentMethodRequest()
			// .customerId(customerId)
			// .paymentMethodNonce(paymentNew.getNonce());

			// Result<? extends PaymentMethod> methodResult =
			// gateway.paymentMethod().create(methodRequest);
			// System.out.println(methodResult.getTarget().getToken());
			TransactionRequest transactionRequest = new TransactionRequest().amount(new BigDecimal("10.00"))
					.customerId(customerId)
					.paymentMethodNonce(paymentNew.getNonce()).options().submitForSettlement(true).done();
			Result<Transaction> transactionResult = gateway.transaction().sale(transactionRequest);
			if (transactionResult.isSuccess()) {
				System.out.println(transactionResult.getTarget());
				return transactionResult.getTarget();
			} else {

				System.out.println(transactionResult.getErrors());
			}
		}

		return null;
	}

	@Override
	public Plan findPlan(int planId) {
		return planDao.getById(planId);
	}

}
