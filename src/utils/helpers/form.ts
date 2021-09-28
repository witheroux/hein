interface EnhanceOptions {
  error?: (res: Response | Error, form: HTMLFormElement) => void;
  pending?: (data: FormData, form: HTMLFormElement) => void;
  result: (res: Response, form: HTMLFormElement) => void;
  validate?: boolean;
}

export function checkValidity(form: HTMLFormElement) {
  async function checkOnSubmit(e: SubmitEvent): Promise<void> {
    console.log('checking');
    const invalidInput: HTMLElement = form.querySelector(':invalid');
    console.log(invalidInput);
    if (!form.checkValidity()) {
      e.preventDefault();
      invalidInput.focus();
      return;
    }
  }

  console.log(form);

  form.addEventListener('submit', checkOnSubmit);

  return {
    destroy() {
      form.removeEventListener('submit', checkOnSubmit);
    }
  }
}

export function enhance(form: HTMLFormElement, { error, pending, result, validate }: EnhanceOptions) {
  async function submitForm(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const body = new FormData(form);

    if (pending) {
      pending(body, form);
    }

    if (validate && !form.checkValidity()) {
      const invalidInput: HTMLElement = form.querySelector(':invalid');
      invalidInput.focus();
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: form.method,
        headers: {
          accept: 'application/json',
        },
        body,
      });
  
      if (res.ok) {
        result(res, form);
      } else if (error) {
        error(res, form);
      } else {
        console.error(await res.text())
      }
    } catch (e) {
      if (error) {
        error(e, form);
      } else {
        throw e;
      }
    }
  }

  form.addEventListener('submit', submitForm);

  return {
    destroy() {
      form.removeEventListener('submit', submitForm);
    }
  }
}