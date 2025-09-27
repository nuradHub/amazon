import { formatCurrency } from "../../../scripts/checkout2/formatCurrency.js";

describe('Tests Suites: FormatCurrency', ()=>{
  it('if its works with value', ()=>{
    expect(formatCurrency(255)).toEqual('2.55');
  });

  it('works with zero', ()=>{
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('works with rounding', ()=>{
    expect(formatCurrency(200.5)).toEqual('2.01');
  }); 
  
})