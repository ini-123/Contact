// Simple client-side validation with accessible error messages and a toast
(function(){
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastClose = document.getElementById('toast-close');

  function showError(name, message){
    const el = form.querySelector(`[data-for="${name}"]`);
    if(!el) return;
    el.textContent = message;
    const input = form.querySelector(`#${name}`) || form.querySelector(`[name="${name}"]`);
    if(input){
      input.classList.add('input-error');
      // for radio sets, mark wrapper
      if(input.type === 'radio'){
        const parent = input.closest('.radios');
        if(parent) parent.querySelectorAll('.radio-btn').forEach(r=>r.classList.add('error'));
      }
    }
  }

  function clearErrors(){
    // Only clear the text content of the error paragraphs (they have data-for)
    form.querySelectorAll('.error[data-for]').forEach(el=>el.textContent='');
    // remove input-level visual indicators
    form.querySelectorAll('.input-error').forEach(i=>i.classList.remove('input-error'));
    // remove radio wrapper error state
    form.querySelectorAll('.radio-btn.error').forEach(r=>r.classList.remove('error'));
  }

  function validate(){
    clearErrors();
    let ok = true;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const consent = form.consent.checked;
    const query = form.query.value; // will be undefined if none

    if(!firstName){ showError('firstName', 'This field is required'); ok=false; }
    if(!lastName){ showError('lastName', 'This field is required'); ok=false; }
    if(!email){ showError('email', 'This field is required'); ok=false; }
    else if(!/^\S+@\S+\.\S+$/.test(email)){ showError('email', 'Please enter a valid email address'); ok=false; }

    if(!query){ showError('query', 'Please select a query type'); ok=false; }
    if(!message){ showError('message', 'This field is required'); ok=false; }
    if(!consent){ showError('consent', 'To submit this form, please consent to being contacted'); ok=false; }

    return ok;
  }

  function openToast(){
    toast.classList.add('show');
    setTimeout(()=>{ toast.classList.remove('show'); }, 5000);
  }

  toastClose.addEventListener('click', ()=>{ toast.classList.remove('show'); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(validate()){
      // Simulate send
      openToast();
      form.reset();
      clearErrors();
    }
  });

  // Ensure radio label visuals update in browsers without :has()
  const radioLabels = form.querySelectorAll('.radio-btn');
  form.querySelectorAll('input[type="radio"][name="query"]').forEach(radio=>{
    radio.addEventListener('change', ()=>{
      radioLabels.forEach(lbl=>lbl.classList.remove('selected'));
      const checked = form.querySelector('input[type="radio"][name="query"]:checked');
      if(checked){
        const parent = checked.closest('.radio-btn');
        if(parent) parent.classList.add('selected');
      }
    });
  });

  // Clear errors as user types
  form.addEventListener('input', (e)=>{
    const name = e.target.name || e.target.id;
    if(!name) return;
    const err = form.querySelector(`[data-for="${name}"]`);
    if(err) err.textContent = '';
    if(e.target.classList.contains('input-error')) e.target.classList.remove('input-error');
    if(e.target.type === 'radio'){
      form.querySelectorAll('.radio-btn.error').forEach(r=>r.classList.remove('error'));
    }
  });
})();
